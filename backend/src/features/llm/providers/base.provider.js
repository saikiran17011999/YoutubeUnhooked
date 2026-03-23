/**
 * Base LLM Provider
 * Abstract base class for all LLM providers
 */

class BaseLLMProvider {
  constructor(config = {}) {
    this.config = config;

    // Ensure derived classes implement required methods
    if (this.constructor === BaseLLMProvider) {
      throw new Error('BaseLLMProvider is abstract and cannot be instantiated');
    }
  }

  /**
   * Get provider name
   * @returns {string}
   */
  get name() {
    throw new Error('Provider must implement name getter');
  }

  /**
   * Check if provider is configured
   * @returns {boolean}
   */
  isConfigured() {
    throw new Error('Provider must implement isConfigured()');
  }

  /**
   * Generate a completion from the LLM
   * @param {string} prompt - The prompt to send
   * @param {Object} options - Generation options
   * @returns {Promise<string>} - Generated text
   */
  async complete(prompt, options = {}) {
    throw new Error('Provider must implement complete()');
  }

  /**
   * Generate a completion with JSON output
   * @param {string} prompt - The prompt to send
   * @param {Object} options - Generation options
   * @returns {Promise<Object>} - Parsed JSON response
   */
  async completeJSON(prompt, options = {}) {
    const response = await this.complete(prompt, options);

    try {
      // Try to extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse LLM JSON response:', error.message);
      throw new Error('Invalid JSON response from LLM');
    }
  }

  /**
   * Build system prompt for summarization
   * @returns {string}
   */
  getSummarizationSystemPrompt() {
    return `You are an expert at summarizing educational and technical video content.
Your summaries are concise, accurate, and highlight the most important information.
Always respond in valid JSON format when requested.`;
  }
}

module.exports = BaseLLMProvider;
