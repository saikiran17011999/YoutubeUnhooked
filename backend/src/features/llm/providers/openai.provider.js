/**
 * OpenAI LLM Provider
 * Implementation for OpenAI/GPT models
 */

const OpenAI = require('openai');
const BaseLLMProvider = require('./base.provider');
const config = require('../../../config');

class OpenAIProvider extends BaseLLMProvider {
  constructor() {
    super(config.llm.openai);
    this.client = null;
  }

  get name() {
    return 'openai';
  }

  isConfigured() {
    return !!this.config.apiKey;
  }

  /**
   * Initialize OpenAI client (lazy initialization)
   */
  getClient() {
    if (!this.client) {
      if (!this.isConfigured()) {
        throw new Error('OpenAI API key not configured');
      }

      this.client = new OpenAI({
        apiKey: this.config.apiKey
      });
    }

    return this.client;
  }

  /**
   * Generate a completion from OpenAI
   */
  async complete(prompt, options = {}) {
    const client = this.getClient();

    const {
      model = this.config.model || 'gpt-4o-mini',
      maxTokens = this.config.maxTokens || 1000,
      temperature = 0.3,
      systemPrompt = this.getSummarizationSystemPrompt()
    } = options;

    try {
      const response = await client.chat.completions.create({
        model,
        max_tokens: maxTokens,
        temperature,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ]
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('OpenAI API error:', error.message);

      if (error.status === 401) {
        throw new Error('Invalid OpenAI API key');
      }
      if (error.status === 429) {
        throw new Error('OpenAI rate limit exceeded. Please try again later.');
      }

      throw new Error(`OpenAI API error: ${error.message}`);
    }
  }

  /**
   * Generate completion with JSON mode
   */
  async completeJSON(prompt, options = {}) {
    const client = this.getClient();

    const {
      model = this.config.model || 'gpt-4o-mini',
      maxTokens = this.config.maxTokens || 1000,
      temperature = 0.3,
      systemPrompt = this.getSummarizationSystemPrompt()
    } = options;

    try {
      const response = await client.chat.completions.create({
        model,
        max_tokens: maxTokens,
        temperature,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt + '\n\nAlways respond with valid JSON.' },
          { role: 'user', content: prompt }
        ]
      });

      const content = response.choices[0]?.message?.content || '{}';
      return JSON.parse(content);
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error('Invalid JSON response from OpenAI');
      }
      throw error;
    }
  }
}

module.exports = OpenAIProvider;
