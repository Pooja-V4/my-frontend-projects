pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// SYNONYM DATABASE 
const synonymDatabase = {
  "javascript": ["js", "ecmascript", "es6", "es2015", "node.js", "nodejs"],
  "typescript": ["ts"],
  "python": ["py"],
  "c++": ["cpp", "cplusplus"],
  "c#": ["csharp", "c sharp"],
  "objective-c": ["objc", "objective c"],
  "react": ["reactjs", "react.js"],
  "angular": ["angularjs", "angular.js"],
  "vue": ["vuejs", "vue.js"],
  "node.js": ["nodejs", "node"],
  "asp.net": ["aspnet", "asp net"],
  "react native": ["reactnative"],
  "postgresql": ["postgres", "psql"],
  "mongodb": ["mongo"],
  "mysql": ["my sql"],
  "amazon web services": ["aws"],
  "google cloud platform": ["gcp", "google cloud"],
  "microsoft azure": ["azure"],
  "continuous integration": ["ci", "ci/cd"],
  "continuous deployment": ["cd", "ci/cd"],
  "machine learning": ["ml", "machinelearning"],
  "artificial intelligence": ["ai"],
  "natural language processing": ["nlp"],
  "user interface": ["ui"],
  "user experience": ["ux"],
  "application programming interface": ["api"],
  "representational state transfer": ["rest", "restful"],
  "object oriented programming": ["oop"],
  "test driven development": ["tdd"],
  "project management": ["pm"],
  "data analysis": ["data analytics"],
  "software development": ["software engineering"],
  "full stack": ["fullstack", "full-stack"],
  "front end": ["frontend", "front-end"],
  "back end": ["backend", "back-end"],
  "web development": ["web dev"],
  "mobile development": ["mobile dev"],
  "agile methodology": ["agile", "scrum"],
  "version control": ["git", "source control"],
};

// SKILLS DATABASE 
const technicalSkillsDatabase = [
  "python", "java", "javascript", "typescript", "c++", "c#", "ruby", "go", "rust",
  "swift", "kotlin", "scala", "php", "perl", "r", "matlab", "julia", "dart",
  "objective-c", "shell", "bash", "powershell", "html", "css", "sass", "less",
  "scss", "xml", "json", "ajax", "websocket", "react", "angular", "vue", "svelte",
  "ember", "backbone", "jquery", "bootstrap", "tailwind", "material-ui", "ant design",
  "chakra ui", "django", "flask", "fastapi", "spring", "spring boot", "laravel",
  "express", "nest.js", "rails", "asp.net", "node.js", "koa", "hapi", "react native",
  "flutter", "ionic", "xamarin", "swift ui", "android studio", "mysql", "postgresql",
  "sqlite", "oracle", "sql server", "mariadb", "mongodb", "redis", "cassandra",
  "couchdb", "dynamodb", "neo4j", "elasticsearch", "firebase", "aws", "azure", "gcp",
  "google cloud", "amazon web services", "heroku", "digitalocean", "linode",
  "cloudflare", "docker", "kubernetes", "jenkins", "gitlab", "github actions",
  "circleci", "travis ci", "ansible", "terraform", "puppet", "chef", "vagrant",
  "prometheus", "grafana", "nagios", "git", "github", "gitlab", "bitbucket", "svn",
  "mercurial", "jest", "mocha", "jasmine", "pytest", "junit", "selenium", "cypress",
  "testng", "cucumber", "postman", "rest", "graphql", "grpc", "soap", "api",
  "restful", "microservices", "tensorflow", "pytorch", "keras", "scikit-learn",
  "pandas", "numpy", "machine learning", "deep learning", "neural networks", "nlp",
  "computer vision", "data analysis", "data science", "hadoop", "spark", "kafka",
  "airflow", "hive", "pig", "flink", "figma", "sketch", "adobe xd", "photoshop",
  "illustrator", "invision", "ui design", "ux design", "wireframing", "prototyping",
  "jira", "confluence", "trello", "asana", "slack", "microsoft teams", "agile",
  "scrum", "kanban", "waterfall", "project management", "oauth", "jwt", "ssl",
  "tls", "encryption", "authentication", "authorization", "cybersecurity",
  "penetration testing", "ci/cd", "devops", "serverless", "lambda", "cloudformation",
  "responsive design", "cross-browser", "accessibility", "seo", "performance optimization",
  "code review", "debugging"
];

// Global variable to store extracted keywords
let extractedKeywords = [];

const fileInput = document.getElementById("resumeFile");
const resumeTextArea = document.getElementById("resumeText");
const fileUploadArea = document.getElementById("fileUploadArea");

fileUploadArea.addEventListener("click", function () {
  fileInput.click();
});

fileUploadArea.addEventListener("dragover", function (e) {
  e.preventDefault();
  fileUploadArea.style.borderColor = "var(--primary)";
  fileUploadArea.style.backgroundColor = "rgba(237, 58, 94, 0.1)";
});

fileUploadArea.addEventListener("dragleave", function () {
  fileUploadArea.style.borderColor = "#475569";
  fileUploadArea.style.backgroundColor = "var(--dark)";
});

fileUploadArea.addEventListener("drop", function (e) {
  e.preventDefault();
  fileUploadArea.style.borderColor = "#475569";
  fileUploadArea.style.backgroundColor = "var(--dark)";

  if (e.dataTransfer.files.length) {
    fileInput.files = e.dataTransfer.files;
    handleFileUpload(e.dataTransfer.files[0]);
  }
});

fileInput.addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;
  handleFileUpload(file);
});

async function handleFileUpload(file) {
  if (file.type !== "application/pdf") {
    alert("⚠️ Please upload a valid PDF file!");
    fileInput.value = "";
    return;
  }

  fileUploadArea.innerHTML = `
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2">Extracting text from PDF...</p>
      `;

  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = '';

    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
    }

    // Clean up the extracted text
    const cleanText = fullText
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s.,!?\-@#]/g, '')
      .trim();

    resumeTextArea.value = cleanText;

    fileUploadArea.innerHTML = `
          <i class="fas fa-check-circle text-success"></i>
          <h5>PDF Successfully Processed!</h5>
          <p>Text extracted from ${pdf.numPages} page(s)</p>
          <small class="text-muted">${cleanText.split(' ').length} words extracted</small>
        `;

    fileUploadArea.classList.add('bounce-in');
    setTimeout(() => {
      fileUploadArea.classList.remove('bounce-in');
    }, 1000);

  } catch (error) {
    console.error('PDF processing error:', error);
    fileUploadArea.innerHTML = `
          <i class="fas fa-exclamation-triangle text-danger"></i>
          <h5>PDF Processing Failed</h5>
          <p>Please paste your resume text manually</p>
        `;
    alert('⚠️ PDF processing failed. Please paste your resume text manually in the text area below.');
  }
}

// MULTI-WORD PHRASE EXTRACTION
function extractMultiWordPhrases(text) {
  const cleanText = text.toLowerCase().replace(/[^a-z0-9\s\-\/\.]/g, " ");
  const phrases = new Set();

  const words = cleanText.split(/\s+/);

  for (let len = 4; len >= 2; len--) {
    for (let i = 0; i <= words.length - len; i++) {
      const phrase = words.slice(i, i + len).join(" ");

      if (technicalSkillsDatabase.includes(phrase)) {
        phrases.add(phrase);
      }

      for (const [key, synonyms] of Object.entries(synonymDatabase)) {
        if (key === phrase || synonyms.includes(phrase)) {
          phrases.add(phrase);
        }
      }
    }
  }

  return Array.from(phrases);
}

// EXTRACT SINGLE WORD TECHNICAL 
function extractSingleWordTerms(text) {
  const cleanText = text.toLowerCase().replace(/[^a-z0-9+#\s]/g, " ");
  const words = cleanText.split(/\s+/).filter(Boolean);

  const technicalTerms = new Set();
  const frequency = {};

  words.forEach(word => {
    if (word.length >= 2 && technicalSkillsDatabase.includes(word)) {
      technicalTerms.add(word);
      frequency[word] = (frequency[word] || 0) + 1;
    }
  });

  return Array.from(technicalTerms).sort((a, b) =>
    (frequency[b] || 0) - (frequency[a] || 0)
  );
}

// KEYWORD EXTRACTION 
function extractKeywordsFromText(text) {
  const phrases = extractMultiWordPhrases(text);
  const singleWords = extractSingleWordTerms(text);

  const filteredSingleWords = singleWords.filter(word => {
    return !phrases.some(phrase => phrase.includes(word) && phrase !== word);
  });

  const allKeywords = [...phrases, ...filteredSingleWords];
  return allKeywords.slice(0, 30);
}

// SYNONYM/ABBREVIATION MATCHING FUNCTION 
function findSynonymMatch(keyword, text) {
  const normalizedText = text.toLowerCase();

  for (const [mainTerm, synonyms] of Object.entries(synonymDatabase)) {
    if (mainTerm === keyword || synonyms.includes(keyword)) {
      const mainRegex = new RegExp(`\\b${mainTerm}\\b`, 'i');
      if (mainRegex.test(normalizedText)) {
        return { found: true, matchedAs: mainTerm, type: 'synonym' };
      }

      for (const syn of synonyms) {
        const synRegex = new RegExp(`\\b${syn}\\b`, 'i');
        if (synRegex.test(normalizedText)) {
          return { found: true, matchedAs: syn, type: 'synonym' };
        }
      }
    }
  }

  return { found: false };
}

// INTELLIGENT KEYWORD MATCHING WITH SCORING 
function checkKeywordMatch(resumeText, keyword) {
  const normalizedResume = resumeText.toLowerCase();
  const normalizedKeyword = keyword.toLowerCase();

  // 1. Exact match (highest score)
  const exactRegex = new RegExp(`\\b${normalizedKeyword}\\b`, 'i');
  if (exactRegex.test(normalizedResume)) {
    return { matched: true, type: 'exact', score: 1.0, displayText: keyword };
  }

  // 2. Synonym/Abbreviation match (high score)
  const synonymMatch = findSynonymMatch(normalizedKeyword, normalizedResume);
  if (synonymMatch.found) {
    return {
      matched: true,
      type: 'synonym',
      score: 0.9,
      displayText: `${keyword} (found as: ${synonymMatch.matchedAs})`
    };
  }

  // 3. Partial match (lower score)
  if (normalizedResume.includes(normalizedKeyword)) {
    return { matched: true, type: 'partial', score: 0.6, displayText: keyword };
  }

  return { matched: false, score: 0 };
}

// EXTRACT KEYWORDS FUNCTION (UI) 
function extractKeywords() {
  const text = document.getElementById('jobText').value.trim();
  const outputDiv = document.getElementById('keywordsOutput');
  const extractedKeywordsDiv = document.getElementById('extractedKeywords');

  outputDiv.innerHTML = "";

  if (!text) {
    alert("Please paste a job description first!");
    return;
  }

  outputDiv.innerHTML = '<div class="text-center"><div class="spinner-border spinner-border-sm text-primary" role="status"></div> Analyzing with AI...</div>';

  setTimeout(() => {
    const extracted = extractKeywordsFromText(text);

    if (extracted.length === 0) {
      outputDiv.innerHTML = "<p class='text-muted'><em>No technical keywords found.</em></p>";
      return;
    }

    extractedKeywords = extracted;

    outputDiv.innerHTML = '';
    extracted.forEach(term => {
      const span = document.createElement('span');
      span.classList.add('badge', 'keyword-badge', 'me-2', 'mb-2');

      if (term.includes(' ')) {
        span.innerHTML = `<i class="fas fa-link me-1"></i>${term}`;
      } else {
        span.textContent = term;
      }

      outputDiv.appendChild(span);
    });

    extractedKeywordsDiv.classList.remove('d-none');
    extractedKeywordsDiv.classList.add('fade-in');

    const successMsg = document.createElement('div');
    successMsg.classList.add('alert', 'alert-success', 'mt-3', 'py-2');
    successMsg.innerHTML = `
          <i class="fas fa-check-circle me-2"></i>
          <strong>Extracted ${extracted.length} keywords</strong> including multi-word phrases and technical terms!
        `;
    outputDiv.appendChild(successMsg);
  }, 1000);
}

function analyzeResume() {
  const resume = document.getElementById("resumeText").value;
  const job = document.getElementById("jobText").value;
  const resultSection = document.getElementById("resultSection");

  if (!resume || !job) {
    alert("⚠️ Please fill both the Resume and Job Description fields!");
    return;
  }

  const analyzeBtn = document.getElementById("analyzeBtn");
  const originalText = analyzeBtn.innerHTML;
  analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Analyzing with AI...';
  analyzeBtn.disabled = true;

  setTimeout(() => {
    let jobKeywords = [];

    if (extractedKeywords.length > 0) {
      jobKeywords = extractedKeywords;
    } else {
      jobKeywords = extractKeywordsFromText(job);

      const extractedKeywordsDiv = document.getElementById('extractedKeywords');
      const outputDiv = document.getElementById('keywordsOutput');
      extractedKeywordsDiv.classList.remove('d-none');
      outputDiv.innerHTML = jobKeywords.map(term => {
        return `<span class="badge keyword-badge me-2 mb-2">${term}</span>`;
      }).join('');
    }

    let matchedKeywords = [];
    let missingKeywords = [];
    let totalScore = 0;
    let maxPossibleScore = jobKeywords.length;

    jobKeywords.forEach(keyword => {
      const matchResult = checkKeywordMatch(resume, keyword);

      if (matchResult.matched) {
        matchedKeywords.push({
          keyword: keyword,
          type: matchResult.type,
          score: matchResult.score,
          displayText: matchResult.displayText
        });
        totalScore += matchResult.score;
      } else {
        missingKeywords.push(keyword);
      }
    });

    const weightedScore = Math.round((totalScore / maxPossibleScore) * 100);

    document.getElementById("scorePercent").textContent = weightedScore + "%";
    const scoreBar = document.getElementById("scoreBar");

    setTimeout(() => {
      scoreBar.style.width = weightedScore + "%";
    }, 300);

    scoreBar.classList.remove("bg-danger", "bg-warning", "bg-success");

    if (weightedScore < 40) scoreBar.classList.add("bg-danger");
    else if (weightedScore < 70) scoreBar.classList.add("bg-warning");
    else scoreBar.classList.add("bg-success");

    document.getElementById("matchedCount").textContent = matchedKeywords.length;
    document.getElementById("missingCount").textContent = missingKeywords.length;

    // Display matched keywords
    if (matchedKeywords.length > 0) {
      document.getElementById("matchedWords").innerHTML = matchedKeywords.map(item => {
        let badgeClass = '';
        let icon = '';

        if (item.type === 'exact') {
          badgeClass = 'badge-exact';
          icon = '<i class="fas fa-check me-1"></i>';
        } else if (item.type === 'synonym') {
          badgeClass = 'badge-synonym';
          icon = '<i class="fas fa-link me-1"></i>';
        } else if (item.type === 'partial') {
          badgeClass = 'badge-partial';
          icon = '<i class="fas fa-search me-1"></i>';
        }

        return `<span class="badge ${badgeClass} text-white me-2 mb-2">${icon}${item.displayText}</span>`;
      }).join("");
    } else {
      document.getElementById("matchedWords").innerHTML = "<span class='text-muted'>No keywords matched</span>";
    }

    // Display missing keywords
    if (missingKeywords.length > 0) {
      document.getElementById("missingWords").innerHTML = missingKeywords.map(w =>
        `<span class="badge bg-danger text-white me-2 mb-2"><i class="fas fa-times me-1"></i>${w}</span>`
      ).join("");
    } else {
      document.getElementById("missingWords").innerHTML = "<span class='text-success'><i class='fas fa-trophy me-2'></i>Perfect match! No keywords missing 🎉</span>";
    }

    // Generate recommendations
    const recommendations = document.getElementById("recommendations");
    let recText = "";

    if (weightedScore >= 85) {
      recText = `<strong>🌟 Outstanding!</strong> Your resume is excellently optimized for this position. You have ${matchedKeywords.length} matching keywords with strong alignment. Apply with confidence!`;
    } else if (weightedScore >= 70) {
      recText = `<strong>✅ Great Match!</strong> Your resume shows ${matchedKeywords.length} matches. To improve further, consider adding: <strong>${missingKeywords.slice(0, 3).join(', ')}</strong>${missingKeywords.length > 3 ? ' and others.' : '.'}`;
    } else if (weightedScore >= 50) {
      recText = `<strong>⚠️ Good Foundation.</strong> You have ${matchedKeywords.length} matches, but missing key terms. Priority additions: <strong>${missingKeywords.slice(0, 5).join(', ')}</strong>. Focus on these to boost your score.`;
    } else {
      recText = `<strong>🔧 Needs Optimization.</strong> Your resume requires significant revision. Critical missing keywords: <strong>${missingKeywords.slice(0, 5).join(', ')}</strong>. Consider tailoring your resume to include more relevant technical skills and experiences.`;
    }

    const synonymMatches = matchedKeywords.filter(k => k.type === 'synonym').length;
    if (synonymMatches > 0) {
      recText += `<br><br><i class="fas fa-lightbulb text-warning me-2"></i><em>Note: ${synonymMatches} keyword(s) matched through synonyms/abbreviations, showing good keyword diversity!</em>`;
    }

    recommendations.innerHTML = recText;

    // Show result section
    resultSection.classList.add("show");

    const resultElements = resultSection.querySelectorAll('.card, .progress, .keyword-section, .bg-light');
    resultElements.forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      setTimeout(() => {
        el.style.transition = 'all 0.5s ease';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, index * 100);
    });

    analyzeBtn.innerHTML = originalText;
    analyzeBtn.disabled = false;

    // Scroll to results
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 1500);
}

// EVENT LISTENERS 
document.getElementById("extractKeywordsBtn").addEventListener("click", extractKeywords);
document.getElementById("analyzeBtn").addEventListener("click", analyzeResume);

// Initialize page animations
document.addEventListener('DOMContentLoaded', function () {
  const featureCards = document.querySelectorAll('.feature-card');
  featureCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.2}s`;
  });

  const container = document.querySelector('.app-container');
  container.style.opacity = '0';
  container.style.transform = 'translateY(20px)';

  setTimeout(() => {
    container.style.transition = 'all 0.5s ease';
    container.style.opacity = '1';
    container.style.transform = 'translateY(0)';
  }, 300);
});