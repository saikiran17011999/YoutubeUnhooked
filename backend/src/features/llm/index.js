/**
 * LLM Feature Module
 * Exports all LLM-related components
 */

const llmService = require('./service/llm.service');
const llmController = require('./controller/llm.controller');
const llmRoutes = require('./routes/llm.routes');
const {
  getProvider,
  getAvailableProviders,
  OpenAIProvider,
  AnthropicProvider
} = require('./providers');

module.exports = {
  llmService,
  llmController,
  llmRoutes,
  getProvider,
  getAvailableProviders,
  OpenAIProvider,
  AnthropicProvider
};
