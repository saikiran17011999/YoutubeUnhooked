/**
 * LLM Provider Factory
 * Returns the configured LLM provider
 */

const config = require('../../../config');
const OpenAIProvider = require('./openai.provider');
const AnthropicProvider = require('./anthropic.provider');

// Provider registry
const providers = {
  openai: OpenAIProvider,
  anthropic: AnthropicProvider
};

/**
 * Get the configured LLM provider instance
 * @returns {BaseLLMProvider}
 */
function getProvider() {
  const providerName = config.llm.provider;

  if (!providers[providerName]) {
    throw new Error(`Unknown LLM provider: ${providerName}. Available: ${Object.keys(providers).join(', ')}`);
  }

  const Provider = providers[providerName];
  const instance = new Provider();

  if (!instance.isConfigured()) {
    throw new Error(`LLM provider '${providerName}' is not configured. Check your API key.`);
  }

  return instance;
}

/**
 * Get all available providers
 * @returns {Object}
 */
function getAvailableProviders() {
  return Object.keys(providers).map(name => {
    const Provider = providers[name];
    const instance = new Provider();
    return {
      name,
      configured: instance.isConfigured()
    };
  });
}

module.exports = {
  getProvider,
  getAvailableProviders,
  OpenAIProvider,
  AnthropicProvider
};
