#!/usr/bin/env node
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */

const { Extractor, ExtractorConfig } = require('@microsoft/api-extractor')
const { pre } = require('./pre-rollup.js')
const { post } = require('./post-rollup.js')


function runApiExtractor() {
const apiExtractorJsonPath = './api-extractor.json'

// Load and parse the api-extractor.json file
const extractorConfig = ExtractorConfig.loadFileAndPrepare(apiExtractorJsonPath);

// Invoke API Extractor
const extractorResult = Extractor.invoke(extractorConfig, {
  localBuild: true,
  showVerboseMessages: true
})

if (extractorResult.succeeded) {
  console.log(`API Extractor completed successfully`);
  return 0
} else {
  console.error(
    `API Extractor completed with ${extractorResult.errorCount} errors` +
      ` and ${extractorResult.warningCount} warnings`
  );
  return 1
}
}



;(async () => {
  const preResults = await pre()
  const exitCode = await runApiExtractor()
  await post(preResults)
})()
