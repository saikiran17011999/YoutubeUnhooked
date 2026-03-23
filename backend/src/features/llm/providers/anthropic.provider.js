/**
 * Anthropic LLM Provider
 * Implementation for Claude models
 */

const axios = require('axios');
const BaseLLMProvider = require('./base.provider');
const config = require('../../../config');

class AnthropicProvider extends BaseLLMProvider {
  constructor() {
    super(config.llm.anthropic);
    this.baseUrl = 'https://api.anthropic.com/v1';
  }

  get name() {
    return 'anthropic';
  }

  isConfigured() {
    return !!this.config.apiKey;
  }

  /**
   * Generate a completion from Anthropic
   */
  async complete(prompt, options = {}) {
    if (!this.isConfigured()) {
      throw new Error('Anthropic API key not configured');
    }

    const {
      model = this.config.model || 'claude-sonnet-4-20250514',
      maxTokens = this.config.maxTokens || 1000,
      temperature = 0.3,
      systemPrompt = this.getSummarizationSystemPrompt()
    } = options;

    try {
      const response = await axios.post(
        `${this.baseUrl}/messages`,
        {
          model,
          max_tokens: maxTokens,
          system: systemPrompt,
          messages: [
            { role: 'user', content: prompt }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.config.apiKey,
            'anthropic-version': '2023-06-01'
          }
        }
      );

      // Extract text from response
      const content = response.data.content;
      if (Array.isArray(content)) {
        return content
          .filter(block => block.type === 'text')
          .map(block => block.text)
          .join('');
      }

      return '';
    } catch (error) {
      console.error('Anthropic API error:', error.response?.data || error.message);

      if (error.response?.status === 401) {
        throw new Error('Invalid Anthropic API key');
      }
      if (error.response?.status === 429) {
        throw new Error('Anthropic rate limit exceeded. Please try again later.');
      }

      throw new Error(`Anthropic API error: ${error.message}`);
    }
  }

  /**
   * Generate completion with JSON output
   */
  async completeJSON(prompt, options = {}) {
    // Add JSON instruction to prompt
    const jsonPrompt = `${prompt}

IMPORTANT: Respond ONLY with valid JSON. No additional text before or after the JSON.`;

    const response = await this.complete(jsonPrompt, {
      ...options,
      systemPrompt: (options.systemPrompt || this.getSummarizationSystemPrompt()) +
        '\n\nAlways respond with valid JSON only, no additional text.'
    });

    try {
      // Try to extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse Anthropic JSON response:', response);
      throw new Error('Invalid JSON response from Anthropic');
    }
  }
}

module.exports = AnthropicProvider;
