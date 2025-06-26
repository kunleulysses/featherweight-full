/**
 * Specialized Gmail content parser for SendGrid inbound parse webhook
 * Handles Gmail's specific multipart format and quoted-printable encoding
 */

export class GmailContentParser {
  
  /**
   * Parse Gmail email content from SendGrid multipart data
   */
  static parseContent(bufferString: string): {
    sender: string;
    subject: string;
    content: string;
    inReplyTo?: string;
    messageId?: string;
    references?: string;
  } {
    console.log('🔍 Gmail-specific content parsing started');
    console.log(`🔍 Buffer length: ${bufferString.length} characters`);
    
    // Debug: Show field structure
    const fieldMatches = bufferString.match(/Content-Disposition: form-data; name="([^"]+)"/g);
    if (fieldMatches) {
      console.log(`🔍 Available form fields: ${fieldMatches.map(m => {
        const match = m.match(/name="([^"]+)"/);
        return match ? match[1] : 'unknown';
      }).join(', ')}`);
    }
    
    let sender = 'unknown@example.com';
    let subject = 'No Subject';
    let content = '';
    let inReplyTo = undefined;
    let messageId = undefined;
    let references = undefined;
    
    // First, try to extract from the 'text' field (most reliable for Gmail)
    const textFieldMatch = bufferString.match(/Content-Disposition: form-data; name="text"\r?\n\r?\n([^]*?)(?:\r?\n--[a-zA-Z0-9]+)/);
    if (textFieldMatch && textFieldMatch[1]) {
      const rawContent = textFieldMatch[1].trim();
      if (rawContent.length > 0) {
        content = this.cleanAndDecodeContent(rawContent);
        console.log(`✅ Extracted content from text field (${content.length} chars): ${content.substring(0, 100)}...`);
      }
    }
    
    // If no content from text field, try alternative field names
    if (!content || content.length < 5) {
      console.log(`🔍 Text field extraction failed, trying alternative fields...`);
      
      // Try other common field names
      const alternativePatterns = [
        /Content-Disposition: form-data; name="plain"\r?\n\r?\n([^]*?)(?:\r?\n--[a-zA-Z0-9]+)/,
        /Content-Disposition: form-data; name="body"\r?\n\r?\n([^]*?)(?:\r?\n--[a-zA-Z0-9]+)/,
        /Content-Disposition: form-data; name="html"\r?\n\r?\n([^]*?)(?:\r?\n--[a-zA-Z0-9]+)/
      ];
      
      for (const pattern of alternativePatterns) {
        const match = bufferString.match(pattern);
        if (match && match[1] && match[1].trim().length > 0) {
          content = this.cleanAndDecodeContent(match[1]);
          console.log(`✅ Extracted content from alternative field (${content.length} chars): ${content.substring(0, 100)}...`);
          break;
        }
      }
    }
    
    // If still no content, extract from the email field which contains the raw email
    if (!content || content.length < 5) {
      console.log(`🔍 Attempting to extract content from raw email field...`);
      
      // Extract the raw email content from the 'email' field
      const emailFieldMatch = bufferString.match(/Content-Disposition: form-data; name="email"\r?\n\r?\n([^]*?)(?:\r?\n--[a-zA-Z0-9]+|$)/);
      if (emailFieldMatch && emailFieldMatch[1]) {
        const rawEmail = emailFieldMatch[1];
        
        // Parse the actual message content from the raw email
        // Look for text/plain content in the email body
        const textPlainMatch = rawEmail.match(/Content-Type: text\/plain[^]*?\r?\n\r?\n([^]*?)(?:\r?\n--|\r?\nContent-Type:|$)/i);
        if (textPlainMatch && textPlainMatch[1]) {
          const extractedContent = this.cleanAndDecodeContent(textPlainMatch[1]);
          if (extractedContent && extractedContent.length > 5) {
            content = extractedContent;
            console.log(`✅ Extracted content from raw email text/plain (${content.length} chars): ${content.substring(0, 100)}...`);
          }
        }
        
        // If no text/plain found, try to extract any readable content
        if (!content || content.length < 5) {
          // Split by lines and find user content (not headers)
          const lines = rawEmail.split(/\r?\n/);
          let foundContent = false;
          let messageLines = [];
          
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Skip email headers
            if (line.includes(':') && (line.includes('Received:') || line.includes('From:') || line.includes('To:') || line.includes('Subject:') || line.includes('Date:') || line.includes('Message-ID:') || line.includes('DKIM-Signature:') || line.includes('Content-Type:') || line.includes('MIME-Version:'))) {
              continue;
            }
            
            // Skip empty lines at the beginning
            if (!foundContent && line.length === 0) {
              continue;
            }
            
            // Once we find actual content, start collecting
            if (line.length > 0 && !line.startsWith('--') && !line.includes('Content-')) {
              foundContent = true;
              // Skip Gmail signature lines and quoted content
              if (!line.startsWith('>') && !line.includes('On ') && !line.includes('wrote:') && line.length < 200) {
                messageLines.push(line);
              }
            }
            
            // Stop at quoted content or signatures
            if (foundContent && (line.startsWith('>') || line.includes('On ') || line.includes('wrote:'))) {
              break;
            }
          }
          
          if (messageLines.length > 0) {
            content = messageLines.join(' ').trim();
            console.log(`✅ Extracted user content from email body (${content.length} chars): ${content.substring(0, 100)}...`);
          }
        }
      }
    }
    
    // Last resort: try the raw email field
    if (!content || content.length < 5) {
      const emailFieldMatch = bufferString.match(/Content-Disposition: form-data; name="email"\r?\n\r?\n([^]*?)(?:\r?\n--[a-zA-Z0-9]+)/);
      if (emailFieldMatch && emailFieldMatch[1]) {
        content = this.extractFromRawEmail(emailFieldMatch[1]);
        console.log(`✅ Extracted content from raw email: ${content.substring(0, 100)}...`);
      }
    }
    
    // Extract sender
    const fromMatch = bufferString.match(/Content-Disposition: form-data; name="from"\r?\n\r?\n([^]*?)(?:\r?\n--)/);
    if (fromMatch && fromMatch[1]) {
      const fromField = fromMatch[1].trim();
      const emailMatch = fromField.match(/<([^>]+)>/);
      sender = emailMatch ? emailMatch[1] : fromField;
    }
    
    // Extract subject
    const subjectMatch = bufferString.match(/Content-Disposition: form-data; name="subject"\r?\n\r?\n([^]*?)(?:\r?\n--)/);
    if (subjectMatch && subjectMatch[1]) {
      subject = subjectMatch[1].trim();
    }
    
    // Extract threading headers from raw email
    const emailFieldForHeaders = bufferString.match(/Content-Disposition: form-data; name="email"\r?\n\r?\n([^]*?)(?:\r?\n--)/);
    if (emailFieldForHeaders && emailFieldForHeaders[1]) {
      const rawEmail = emailFieldForHeaders[1];
      
      // Extract Message-ID
      const messageIdMatch = rawEmail.match(/Message-ID:\s*<([^>]+)>/i);
      if (messageIdMatch) {
        messageId = messageIdMatch[1];
      }
      
      // Extract In-Reply-To
      const inReplyToMatch = rawEmail.match(/In-Reply-To:\s*<([^>]+)>/i);
      if (inReplyToMatch) {
        inReplyTo = inReplyToMatch[1];
      }
      
      // Extract References
      const referencesMatch = rawEmail.match(/References:(.*(?:\r?\n\s+.*)*)/i);
      if (referencesMatch) {
        references = referencesMatch[1].replace(/\r?\n\s+/g, ' ').trim();
      }
    }
    
    console.log(`🔍 Gmail parsing complete - Content length: ${content.length} characters`);
    
    return { sender, subject, content, inReplyTo, messageId, references };
  }
  
  /**
   * Extract content from raw email data
   */
  private static extractFromRawEmail(rawEmail: string): string {
    // Look for Gmail's quoted-printable content
    const quotedPrintableMatch = rawEmail.match(/Content-Transfer-Encoding: quoted-printable\r?\n\r?\n([^]*?)(?:\r?\n\r?\nOn.*wrote:|--|\r?\n\r?\n$)/);
    if (quotedPrintableMatch && quotedPrintableMatch[1]) {
      return this.cleanAndDecodeContent(quotedPrintableMatch[1]);
    }
    
    // Look for plain text content after headers
    const lines = rawEmail.split(/\r?\n/);
    let inHeaders = true;
    let bodyLines = [];
    
    for (const line of lines) {
      // Skip headers until we find the separator
      if (inHeaders) {
        if (line.trim() === '') {
          inHeaders = false;
        }
        continue;
      }
      
      // Stop at quoted reply sections
      if (line.trim().match(/^On .* wrote:/) || line.trim().startsWith('>')) {
        break;
      }
      
      // Add content lines
      bodyLines.push(line);
    }
    
    if (bodyLines.length > 0) {
      return this.cleanAndDecodeContent(bodyLines.join('\n'));
    }
    
    return '';
  }
  
  /**
   * Clean and decode email content
   */
  private static cleanAndDecodeContent(content: string): string {
    // Decode quoted-printable
    let decoded = content
      .replace(/=20/g, ' ')
      .replace(/=3D/g, '=')
      .replace(/=0A/g, '\n')
      .replace(/=0D/g, '\r')
      .replace(/=([0-9A-F]{2})/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)))
      .replace(/=\r?\n/g, ''); // Soft line breaks
    
    // Clean up formatting
    decoded = decoded
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    
    return decoded;
  }
}