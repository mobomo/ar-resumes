# Pre-calculated Embeddings for Resume Data

This directory contains pre-calculated embeddings used by the resume application to provide intelligent responses to user queries.

## Overview

The pre-calculated embeddings are stored in `pre-calculated-embeddings.json` and contain vector representations of resume data, including skills, experience, education, and frequently asked questions with answers.

## Generating Embeddings

To generate or update the embeddings:

1. Ensure Node.js is installed on your system
2. Install the required packages:

```bash
npm install @xenova/transformers
```

3. Navigate to the project root directory
4. Run the embeddings generation script:

```bash
node js/generate-embeddings.js
```

This script will:
- Read your resume data from `js/resume-data.js`
- Process the information into chunks
- Generate vector embeddings for each chunk
- Save the results to `js/data/pre-calculated-embeddings.json`

## How It Works

The script does the following:
1. Reads resume data and QA pairs from the resume-data.js file
2. Initializes the embedding model (Xenova/all-MiniLM-L6-v2)
3. Processes the resume into smaller text chunks
4. Converts each chunk into a vector embedding
5. Saves all the embeddings to a JSON file

## Important Notes

- The embedding generation can take several minutes depending on your system
- The generated file may be large (several MB) depending on the resume data size
- If you update your resume information in resume-data.js, you should regenerate the embeddings
- The embedding model requires an internet connection the first time it runs to download model weights

## Troubleshooting

If you encounter any issues:
- Ensure all dependencies are installed
- Check that your resume-data.js file is properly formatted
- Verify that you have sufficient disk space and memory
- Check the console output for specific error messages