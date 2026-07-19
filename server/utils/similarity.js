// server/utils/similarity.js
//
// Cosine similarity between two equal-length vectors.
// Returns a value from -1 to 1 (1 = identical direction, 0 = unrelated, -1 = opposite).
// We do this in-app rather than via Atlas Vector Search since dataset size here
// is small enough that in-memory comparison is fast and needs zero infra setup.

function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return -1;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) return -1;

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Rank a list of documents (each with an `embedding` field) by similarity to a query vector.
 * @param {number[]} queryVector
 * @param {Array<{embedding: number[]}>} documents
 * @param {number} topK
 * @returns {Array} documents sorted by similarity, each annotated with `_score`
 */
function rankBySimilarity(queryVector, documents, topK = 5) {
  return documents
    .filter((doc) => Array.isArray(doc.embedding) && doc.embedding.length > 0)
    .map((doc) => ({
      ...doc,
      _score: cosineSimilarity(queryVector, doc.embedding),
    }))
    .sort((a, b) => b._score - a._score)
    .slice(0, topK);
}

module.exports = { cosineSimilarity, rankBySimilarity };