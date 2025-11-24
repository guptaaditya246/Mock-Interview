const fs = require("fs");
const path = require("path");

// Path to questions.json
const FILE = path.join(__dirname, "..", "questions.json");

// Metadata keys to ignore completely
const META_KEYS = ["author", "site", "built", "credit", "keywords"];

// Helpers kept for detection only (NO FIXING)
const normalizeDashes = (t) => (typeof t === "string" ? t.replace(/[–—]/g, "-") : t);
const cleanOptionPrefix = (opt) => (typeof opt === "string" ? opt.replace(/^([A-Da-d]\)|[0-9]+\.)\s*/, "").trim() : opt);
const hasUnmatchedBackticks = (str) => (typeof str === "string" ? ((str.match(/`/g) || []).length % 2 !== 0) : false);

function validateQuestion(qObj, topic, index) {
  const issues = [];

  // Validate q
  if (qObj.q === undefined || qObj.q === null) {
    issues.push(`q is missing`);
  } else if (typeof qObj.q !== "string") {
    issues.push(`q is not string (type=${typeof qObj.q})`);
  } else {
    if (qObj.q.trim().length < 5) issues.push(`q too short (<5 chars)`);
    if (hasUnmatchedBackticks(qObj.q)) issues.push(`q has unmatched backticks`);
  }

  // Validate options (NO mutation)
  if (!Array.isArray(qObj.options)) {
    issues.push(`options is not an array`);
  } else {
    if (qObj.options.length !== 4) {
      issues.push(`options.length = ${qObj.options.length} (expected 4)`);
    }

    qObj.options.forEach((opt, optIdx) => {
      if (typeof opt !== "string") {
        issues.push(`options[${optIdx}] not string (type=${typeof opt})`);
      } else {
        if (opt.trim().length < 2) issues.push(`options[${optIdx}] too short`);
        if (hasUnmatchedBackticks(opt)) issues.push(`options[${optIdx}] has unmatched backticks`);
      }
    });

    // detect duplicate options
    const seen = {};
    qObj.options.forEach((o, i) => {
      if (typeof o === "string") {
        const key = o.trim();
        if (!seen[key]) seen[key] = [];
        seen[key].push(i);
      }
    });

    Object.entries(seen).forEach(([text, indices]) => {
      if (indices.length > 1) {
        issues.push(`duplicate option "${text}" at indices [${indices.join(", ")}]`);
      }
    });
  }

  // Validate answer
  if (qObj.answer === undefined || qObj.answer === null) {
    issues.push(`answer missing`);
  } else if (typeof qObj.answer !== "number") {
    issues.push(`answer not number (type=${typeof qObj.answer})`);
  } else {
    if (!Array.isArray(qObj.options)) {
      issues.push(`cannot validate answer range (options not array)`);
    } else if (qObj.answer < 0 || qObj.answer >= qObj.options.length) {
      issues.push(`answer index out of range (${qObj.answer})`);
    }
  }

  // explanation
  if (qObj.explanation !== undefined && qObj.explanation !== null) {
    if (typeof qObj.explanation !== "string") {
      issues.push(`explanation not string (type=${typeof qObj.explanation})`);
    } else {
      if (qObj.explanation.trim().length < 5) issues.push(`explanation too short (<5 chars)`);
      if (hasUnmatchedBackticks(qObj.explanation)) issues.push(`explanation has unmatched backticks`);
    }
  }

  return issues;
}

function validateFile() {
  const fullPath = FILE;

  let raw;
  try {
    raw = fs.readFileSync(fullPath, "utf8");
  } catch (err) {
    console.error(`❌ Cannot read file: ${fullPath}`);
    console.error(err.message);
    process.exit(1);
  }

  let json;
  try {
    json = JSON.parse(raw);
  } catch (err) {
    console.error(`❌ Invalid JSON in ${fullPath}: ${err.message}`);
    process.exit(1);
  }

  console.log(`🔍 Validating (READ-ONLY): ${fullPath}\n`);

  const report = [];

  for (const topic of Object.keys(json)) {
    if (META_KEYS.includes(topic)) continue;

    const list = json[topic];

    if (!Array.isArray(list)) {
      report.push({ topic, index: "-", issues: [`topic is not an array`] });
      continue;
    }

    list.forEach((qObj, index) => {
      const issues = validateQuestion(qObj, topic, index);
      if (issues.length) report.push({ topic, index, issues });
    });
  }

  if (report.length === 0) {
    console.log("✔ No issues found. All questions passed validation.");
    return;
  }

  console.log("⚠️ Issues found:\n");
  report.forEach((entry) => {
    console.log(`${entry.topic}[${entry.index}]:`);
    entry.issues.forEach((i) => console.log(`  • ${i}`));
  });

  console.log("\nℹ️ NOTE: This script does NOT modify anything. It only logs issues.");
}

validateFile();
console.log("\n✨ Read-only validation complete.");