/**
 * Advanced email content extraction specifically for Gmail and other email providers
 * Handles various encoding formats and multipart structures
 */

export class EmailContentExtractor {
  
  /**
   * Extract email content from multipart form data buffer
   */
  static extractFromMultipart(bufferString: string): {
    sender: string;
    subject: string;
    content: string;
    inReplyTo?: string;
  } {
    console.log('🔍 Starting advanced email content extraction');
    
    let sender = 'unknown@example.com';
    let subject = 'No Subject';
    let content = '';
    let inReplyTo = undefined;
    
    // Extract basic fields with proper boundary detection
    const fromMatch = bufferString.match(/Content-Disposition: form-data; name="from"\r?\n\r?\n([^]*?)(?:\r?\n--[a-zA-Z0-9]+)/);
    const subjectMatch = bufferString.match(/Content-Disposition: form-data; name="subject"\r?\n\r?\n([^]*?)(?:\r?\n--[a-zA-Z0-9]+)/);
    const envelopeMatch = bufferString.match(/Content-Disposition: form-data; name="envelope"\r?\n\r?\n([^]*?)(?:\r?\n--[a-zA-Z0-9]+)/);
    
    // Extract sender
    if (fromMatch && fromMatch[1]) {
      const fromField = fromMatch[1].trim();
      const emailMatch = fromField.match(/<([^>]+)>/);
      sender = emailMatch ? emailMatch[1] : fromField;
      console.log(`🔍 Extracted sender from 'from' field: ${sender}`);
    } else if (envelopeMatch && envelopeMatch[1]) {
      try {
        const envelope = JSON.parse(envelopeMatch[1].trim());
        if (envelope.from) {
          sender = envelope.from;
          console.log(`🔍 Extracted sender from envelope: ${sender}`);
        }
      } catch (error) {
        console.warn('Failed to parse envelope:', error);
      }
    }
    
    // Extract subject
    if (subjectMatch && subjectMatch[1]) {
      subject = subjectMatch[1].trim();
      console.log(`🔍 Extracted subject: ${subject}`);
    }
    
    // Extract content using multiple strategies
    content = this.extractContent(bufferString);
    
    // Extract In-Reply-To
    inReplyTo = this.extractInReplyTo(bufferString);
    
    console.log(`🔍 Extracted - Sender: ${sender}, Subject: ${subject}, Content length: ${content.length}`);
    
    return { sender, subject, content, inReplyTo };
  }
  
  /**
   * Extract email content using multiple parsing strategies
   */
  private static extractContent(bufferString: string): string {
    console.log('🔍 Attempting content extraction with multiple strategies');
    
    // Strategy 1: Direct text field extraction
    let content = this.extractFromTextField(bufferString);
    if (content && content.trim().length > 0) {
      console.log('✅ Content extracted using Strategy 1: Direct text field');
      return content.trim();
    }
    
    // Strategy 2: Raw email parsing
    content = this.extractFromRawEmail(bufferString);
    if (content && content.trim().length > 0) {
      console.log('✅ Content extracted using Strategy 2: Raw email parsing');
      return content.trim();
    }
    
    // Strategy 3: Aggressive content hunting
    content = this.extractAggressively(bufferString);
    if (content && content.trim().length > 0) {
      console.log('✅ Content extracted using Strategy 3: Aggressive hunting');
      return content.trim();
    }
    
    console.log('❌ All content extraction strategies failed');
    return '';
  }
  
  /**
   * Strategy 1: Extract from text field in form data
   */
  private static extractFromTextField(bufferString: string): string {
    const patterns = [
      /Content-Disposition: form-data; name="text"\r?\n\r?\n([^]*?)(?:\r?\n--[a-zA-Z0-9]+)/,
      /Content-Disposition: form-data; name="plain"\r?\n\r?\n([^]*?)(?:\r?\n--[a-zA-Z0-9]+)/,
      /Content-Disposition: form-data; name="body-plain"\r?\n\r?\n([^]*?)(?:\r?\n--[a-zA-Z0-9]+)/,
      /name="text"\r?\n\r?\n([^]*?)(?:\r?\n--[a-zA-Z0-9]+)/
    ];
    
    for (const pattern of patterns) {
      const match = bufferString.match(pattern);
      if (match && match[1] && match[1].trim().length > 0) {
        const content = this.cleanContent(match[1]);
        console.log(`🔍 Strategy 1 found content: ${content.substring(0, 100)}...`);
        return content;
      }
    }
    
    return '';
  }
  
  /**
   * Strategy 2: Extract from raw email content
   */
  private static extractFromRawEmail(bufferString: string): string {
    const rawEmailMatch = bufferString.match(/Content-Disposition: form-data; name="email"\r?\n\r?\n([^]*?)(?:\r?\n--[a-zA-Z0-9]+)/);
    if (!rawEmailMatch || !rawEmailMatch[1]) {
      return '';
    }
    
    const rawEmail = rawEmailMatch[1];
    console.log(`🔍 Strategy 2 analyzing raw email, length: ${rawEmail.length}`);
    
    // Gmail quoted-printable pattern - look for actual message content
    const quotedPrintableMatch = rawEmail.match(/Content-Transfer-Encoding: quoted-printable\r?\n\r?\n([^]*?)(?:\r?\n\r?\nOn.*wrote:|--|\r?\n\r?\n$)/);
    if (quotedPrintableMatch && quotedPrintableMatch[1]) {
      const content = this.decodeQuotedPrintable(quotedPrintableMatch[1]);
      console.log(`🔍 Strategy 2 found quoted-printable content: ${content.substring(0, 100)}...`);
      return content;
    }
    
    // Look for content after email headers
    const lines = rawEmail.split(/\r?\n/);
    let inHeaders = true;
    let bodyLines = [];
    let foundContent = false;
    
    for (const line of lines) {
      // Skip headers until we find the empty line that separates headers from body
      if (inHeaders) {
        if (line.trim() === '') {
          inHeaders = false;
        }
        continue;
      }
      
      // We're in the email body now
      const trimmed = line.trim();
      
      // Stop at quoted reply sections
      if (trimmed.match(/^On .* wrote:/) || trimmed.startsWith('>')) {
        break;
      }
      
      // Decode quoted-printable content
      const decoded = this.decodeQuotedPrintable(line);
      
      if (decoded.trim().length > 0) {
        bodyLines.push(decoded);
        foundContent = true;
      } else if (foundContent) {
        bodyLines.push(''); // Keep spacing within content
      }
    }
    
    if (bodyLines.length > 0) {
      const content = this.cleanContent(bodyLines.join('\n'));
      console.log(`🔍 Strategy 2 found email body content: ${content.substring(0, 100)}...`);
      return content;
    }
    
    return '';
  }
  
  /**
   * Strategy 3: Aggressive content extraction
   */
  private static extractAggressively(bufferString: string): string {
    console.log('🔍 Using aggressive content extraction method');
    
    const lines = bufferString.split(/\r?\n/);
    const contentLines = [];
    let inEmailBody = false;
    let foundActualContent = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      
      // Skip empty lines at the beginning
      if (trimmed.length === 0 && !foundActualContent) continue;
      
      // Skip form boundaries and headers
      if (trimmed.startsWith('--') ||
          trimmed.startsWith('Content-Disposition') ||
          trimmed.startsWith('Content-Type') ||
          trimmed.startsWith('MIME-') ||
          trimmed.startsWith('Received:') ||
          trimmed.startsWith('Date:') ||
          trimmed.startsWith('Message-ID:') ||
          trimmed.includes('form-data') ||
          trimmed.includes('boundary=') ||
          trimmed.match(/^[A-Za-z-]+:\s/)) {
        continue;
      }
      
      // Look for the start of the actual email content
      // This typically comes after headers and form fields
      if (!inEmailBody) {
        // Check if this looks like the start of an email or actual message content
        if (trimmed.match(/^(From:|To:|Subject:|Date:)/) ||
            (trimmed.length > 15 && 
             !trimmed.match(/^[\w@.-]+$/) && // Not just email/domain
             !trimmed.includes('featherweight.world') && // Skip our domain references
             !trimmed.includes('parse.featherweight') &&
             !trimmed.includes('Content-Disposition') &&
             !trimmed.includes('form-data') &&
             !trimmed.match(/^\{.*\}$/) && // Not JSON
             !trimmed.match(/^--[a-zA-Z0-9]+/) && // Not boundary
             trimmed.match(/[a-zA-Z]{4,}/) && // Has substantial text
             (trimmed.includes(' ') || trimmed.length > 30))) { // Has spaces or is long
          inEmailBody = true;
          console.log(`🔍 Found start of email body: ${trimmed.substring(0, 50)}...`);
        }
      }
      
      if (inEmailBody) {
        // Stop at quoted reply sections
        if (trimmed.match(/^On .* wrote:/) || 
            trimmed.match(/^>/) ||
            trimmed.match(/^From:.*wrote:/)) {
          break;
        }
        
        // Skip email headers within the body
        if (trimmed.match(/^(From|To|Subject|Date|Message-ID):/)) {
          continue;
        }
        
        // Look for actual message content
        if (trimmed.length > 5 && 
            trimmed.match(/[a-zA-Z]{2,}/) && 
            !trimmed.match(/^[=<>@#+*-]{3,}/) &&
            !trimmed.match(/^\w+@[\w.-]+\.\w+$/) && // Skip standalone emails
            !trimmed.includes('featherweight.world') &&
            !trimmed.match(/^\{.*\}$/)) { // Skip JSON
          
          // Decode quoted-printable if present
          const decoded = this.decodeQuotedPrintable(trimmed);
          contentLines.push(decoded);
          foundActualContent = true;
        } else if (foundActualContent && trimmed.length === 0) {
          // Keep empty lines within content for formatting
          contentLines.push('');
        }
      }
    }
    
    if (contentLines.length > 0) {
      const content = contentLines.join('\n').trim();
      console.log(`🔍 Aggressive extraction found ${contentLines.length} content lines`);
      console.log(`🔍 Sample content: ${content.substring(0, 150)}...`);
      return content;
    }
    
    return '';
  }
  
  /**
   * Extract In-Reply-To header
   */
  private static extractInReplyTo(bufferString: string): string | undefined {
    const rawEmailMatch = bufferString.match(/Content-Disposition: form-data; name="email"[^]*?\r?\n\r?\n([^]*?)(?:\r?\n--|$)/);
    if (!rawEmailMatch || !rawEmailMatch[1]) {
      return undefined;
    }
    
    const inReplyToMatch = rawEmailMatch[1].match(/In-Reply-To:\s*<([^>]+)>/i);
    return inReplyToMatch ? inReplyToMatch[1] : undefined;
  }
  
  /**
   * Decode quoted-printable content
   */
  private static decodeQuotedPrintable(content: string): string {
    return content
      .replace(/=20/g, ' ')
      .replace(/=3D/g, '=')
      .replace(/=0A/g, '\n')
      .replace(/=0D/g, '\r')
      .replace(/=([0-9A-F]{2})/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)))
      .replace(/=\r?\n/g, ''); // Soft line breaks
  }
  
  /**
   * Clean extracted content
   */
  private static cleanContent(content: string): string {
    return content
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }
}