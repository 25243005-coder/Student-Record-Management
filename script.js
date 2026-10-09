/**
 * EduTrack — Student Record Management Dashboard
 * Pure Vanilla JavaScript (ES6+) Implementation
 * 
 * Features:
 * - Full CRUD (Create, Read, Update, Delete)
 * - LocalStorage persistence with initial sample dataset
 * - Search by Name or Register Number
 * - Filter by Department, Year, and Status
 * - Multi-criteria sorting & table header sorting
 * - Input validation & duplicate Register Number prevention
 * - Toast notification feedback system
 * - CSV data export
 * - Statistics calculations (Total, Average, Highest Scorer, Pass Rate)
 * - Light / Dark mode toggle
 * - Mobile responsive drawer menu
 */

// =============================================================================
// 1. Initial State & Sample Data
// =============================================================================

const STORAGE_KEY = 'edutrack_students_data_v1';
const THEME_KEY = 'edutrack_theme_preference';
const PASSING_THRESHOLD = 50;

/** Default realistic sample students list */
const INITIAL_SAMPLE_STUDENTS = [
  {
    regNo: 'REG2024001',
    name: 'Aarav Sharma',
    department: 'Computer Science',
    year: '3rd Year',
    email: 'aarav.sharma@example.edu',
    marks: 92
  },
  {
    regNo: 'REG2024002',
    name: 'Priya Patel',
    department: 'Data Science & AI',
    year: '2nd Year',
    email: 'priya.patel@example.edu',
    marks: 98
  },
  {
    regNo: 'REG2024003',
    name: 'Rohan Verma',
    department: 'Information Technology',
    year: '4th Year',
    email: 'rohan.verma@example.edu',
    marks: 74
  },
  {
    regNo: 'REG2024004',
    name: 'Ananya Iyer',
    department: 'Electronics & Comm.',
    year: '3rd Year',
    email: 'ananya.iyer@example.edu',
    marks: 88
  },
  {
    regNo: 'REG2024005',
    name: 'Vikram Singh',
    department: 'Mechanical Engg',
    year: '1st Year',
    email: 'vikram.singh@example.edu',
    marks: 42
  },
  {
    regNo: 'REG2024006',
    name: 'Sneha Reddy',
    department: 'Computer Science',
    year: '2nd Year',
    email: 'sneha.reddy@example.edu',
    marks: 81
  },
  {
    regNo: 'REG2024007',
    name: 'Kabir Mehta',
    department: 'Civil Engg',
    year: '4th Year',
    email: 'kabir.mehta@example.edu',
    marks: 67
  },
  {
    regNo: 'REG2024008',
    name: 'Neha Gupta',
    department: 'Data Science & AI',
    year: '1st Year',
    email: 'neha.gupta@example.edu',
    marks: 35
  },
  {
    regNo: 'REG2024009',
    name: 'Aditya Nair',
    department: 'Electrical Engg',
    year: '3rd Year',
    email: 'aditya.nair@example.edu',
    marks: 85
  }
];

// App State
let students = [];
let deleteTargetRegNo = null;
let currentSortColumn = 'name';
let currentSortDirection = 'asc';

// =============================================================================
// 2. DOM Elements Cache
// =============================================================================

const DOM = {
  // Stats
  statTotalStudents: document.getElementById('statTotalStudents'),
  statAverageMarks: document.getElementById('statAverageMarks'),
  statAvgGrade: document.getElementById('statAvgGrade'),
  statHighestMarks: document.getElementById('statHighestMarks'),
  statHighestScorerName: document.getElementById('statHighestScorerName'),
  statPassedCount: document.getElementById('statPassedCount'),
  statPassRate: document.getElementById('statPassRate'),

  // Filters & Controls
  searchInput: document.getElementById('searchInput'),
  clearSearchBtn: document.getElementById('clearSearchBtn'),
  deptFilter: document.getElementById('departmentFilter'),
  yearFilter: document.getElementById('yearFilter'),
  statusFilter: document.getElementById('statusFilter'),
  sortBySelect: document.getElementById('sortBySelect'),
  resetFiltersBtn: document.getElementById('resetFiltersBtn'),
  visibleRecordsCount: document.getElementById('visibleRecordsCount'),
  totalRecordsCount: document.getElementById('totalRecordsCount'),
  filterActiveIndicator: document.getElementById('filterActiveIndicator'),
  navStudentCount: document.getElementById('navStudentCount'),

  // Table & Empty State
  studentTable: document.getElementById('studentTable'),
  studentTableBody: document.getElementById('studentTableBody'),
  emptyState: document.getElementById('emptyState'),
  emptyStateTitle: document.getElementById('emptyStateTitle'),
  emptyStateMessage: document.getElementById('emptyStateMessage'),
  emptyClearFiltersBtn: document.getElementById('emptyClearFiltersBtn'),
  emptyAddStudentBtn: document.getElementById('emptyAddStudentBtn'),

  // Add / Edit Modal & Form
  studentModal: document.getElementById('studentModal'),
  studentForm: document.getElementById('studentForm'),
  modalTitle: document.getElementById('modalTitle'),
  modalSubtitle: document.getElementById('modalSubtitle'),
  saveBtnText: document.getElementById('saveBtnText'),
  formOriginalRegNo: document.getElementById('formOriginalRegNo'),
  regNoInput: document.getElementById('regNoInput'),
  nameInput: document.getElementById('nameInput'),
  deptInput: document.getElementById('deptInput'),
  yearInput: document.getElementById('yearInput'),
  emailInput: document.getElementById('emailInput'),
  marksInput: document.getElementById('marksInput'),
  marksPreviewBadge: document.getElementById('marksPreviewBadge'),
  closeModalBtn: document.getElementById('closeModalBtn'),
  cancelModalBtn: document.getElementById('cancelModalBtn'),
  openAddModalBtn: document.getElementById('openAddModalBtn'),
  sidebarAddStudentBtn: document.getElementById('sidebarAddStudentBtn'),

  // Form error displays
  regNoError: document.getElementById('regNoError'),
  nameError: document.getElementById('nameError'),
  deptError: document.getElementById('deptError'),
  yearError: document.getElementById('yearError'),
  emailError: document.getElementById('emailError'),
  marksError: document.getElementById('marksError'),

  // Delete Modal
  deleteModal: document.getElementById('deleteModal'),
  deleteStudentName: document.getElementById('deleteStudentName'),
  deleteStudentReg: document.getElementById('deleteStudentReg'),
  cancelDeleteBtn: document.getElementById('cancelDeleteBtn'),
  confirmDeleteBtn: document.getElementById('confirmDeleteBtn'),

  // Clear All Modal
  clearAllModal: document.getElementById('clearAllModal'),
  btnClearAllRecords: document.getElementById('btnClearAllRecords'),
  cancelClearAllBtn: document.getElementById('cancelClearAllBtn'),
  confirmClearAllBtn: document.getElementById('confirmClearAllBtn'),
  btnResetSampleData: document.getElementById('btnResetSampleData'),
  sidebarResetBtn: document.getElementById('sidebarResetBtn'),

  // Student Profile Quick View Modal
  viewModal: document.getElementById('viewModal'),
  viewAvatar: document.getElementById('viewAvatar'),
  viewStudentName: document.getElementById('viewStudentName'),
  viewRegNo: document.getElementById('viewRegNo'),
  viewEmail: document.getElementById('viewEmail'),
  viewDept: document.getElementById('viewDept'),
  viewYear: document.getElementById('viewYear'),
  viewStatusBadge: document.getElementById('viewStatusBadge'),
  viewGradeBadge: document.getElementById('viewGradeBadge'),
  viewProgressBar: document.getElementById('viewProgressBar'),
  viewMarksScore: document.getElementById('viewMarksScore'),
  viewScoreRemark: document.getElementById('viewScoreRemark'),
  closeViewModalBtn: document.getElementById('closeViewModalBtn'),
  closeViewBtn: document.getElementById('closeViewBtn'),
  editFromViewBtn: document.getElementById('editFromViewBtn'),

  // Layout & Theme
  sidebar: document.getElementById('sidebar'),
  hamburgerBtn: document.getElementById('hamburgerBtn'),
  sidebarCloseBtn: document.getElementById('sidebarCloseBtn'),
  sidebarOverlay: document.getElementById('sidebarOverlay'),
  themeToggleBtn: document.getElementById('themeToggleBtn'),
  quickExportBtn: document.getElementById('quickExportBtn'),
  sidebarExportBtn: document.getElementById('sidebarExportBtn'),
  toastContainer: document.getElementById('toastContainer'),
  currentDateDisplay: document.getElementById('currentDateDisplay')
};

// =============================================================================
// 3. Storage & Initialization
// =============================================================================

/** Load students from LocalStorage or initialize with sample records */
function loadStudents() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      students = JSON.parse(stored);
    } else {
      // First run: Initialize with default sample students
      students = JSON.parse(JSON.stringify(INITIAL_SAMPLE_STUDENTS));
      saveStudentsToStorage();
    }
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
    students = JSON.parse(JSON.stringify(INITIAL_SAMPLE_STUDENTS));
  }
}

/** Save current students array into LocalStorage */
function saveStudentsToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
    showToast('Failed to save data to browser storage', 'error');
  }
}

/** Initialize date and theme */
function initSystemSettings() {
  // Set academic calendar date display
  const now = new Date();
  const dateOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
  if (DOM.currentDateDisplay) {
    DOM.currentDateDisplay.textContent = `Today: ${now.toLocaleDateString(undefined, dateOptions)} • Academic Session`;
  }

  // Load saved theme
  const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
}

// =============================================================================
// 4. Academic Calculations & Grading Helpers
// =============================================================================

/**
 * Returns letter grade and classification for a marks value (0-100)
 */
function getGradeInfo(marks) {
  const m = Number(marks);
  if (m >= 90) return { grade: 'A+', class: 'grade-aplus', remark: 'High Distinction', passed: true };
  if (m >= 80) return { grade: 'A', class: 'grade-a', remark: 'Distinction', passed: true };
  if (m >= 70) return { grade: 'B', class: 'grade-b', remark: 'First Class', passed: true };
  if (m >= 60) return { grade: 'C', class: 'grade-c', remark: 'Second Class', passed: true };
  if (m >= PASSING_THRESHOLD) return { grade: 'D', class: 'grade-d', remark: 'Pass', passed: true };
  return { grade: 'F', class: 'grade-f', remark: 'Needs Improvement (Failed)', passed: false };
}

/**
 * Get CSS class corresponding to department badge
 */
function getDeptBadgeClass(dept) {
  switch (dept) {
    case 'Computer Science': return 'dept-cs';
    case 'Information Technology': return 'dept-it';
    case 'Electronics & Comm.': return 'dept-ec';
    case 'Data Science & AI': return 'dept-ds';
    case 'Mechanical Engg': return 'dept-mech';
    case 'Civil Engg': return 'dept-civil';
    case 'Electrical Engg': return 'dept-ee';
    default: return 'dept-gen';
  }
}

/**
 * Generates consistent background gradient for user avatar based on student name
 */
function generateAvatarGradient(name) {
  const gradients = [
    'linear-gradient(135deg, #6366f1, #8b5cf6)',
    'linear-gradient(135deg, #3b82f6, #06b6d4)',
    'linear-gradient(135deg, #10b981, #059669)',
    'linear-gradient(135deg, #f59e0b, #d97706)',
    'linear-gradient(135deg, #8b5cf6, #ec4899)',
    'linear-gradient(135deg, #14b8a6, #0284c7)',
    'linear-gradient(135deg, #f43f5e, #e11d48)'
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
}

/**
 * Extracts student name initials (e.g. "Aarav Sharma" -> "AS")
 */
function getInitials(name) {
  if (!name) return 'ST';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Recalculate summary statistics card values
 */
function updateDashboardStats() {
  const total = students.length;

  if (total === 0) {
    DOM.statTotalStudents.textContent = '0';
    DOM.statAverageMarks.textContent = '0.0%';
    DOM.statAvgGrade.textContent = 'Grade: --';
    DOM.statHighestMarks.textContent = '0 / 100';
    DOM.statHighestScorerName.textContent = 'No records';
    DOM.statPassedCount.textContent = '0';
    DOM.statPassRate.textContent = 'Pass Rate: 0%';
    DOM.totalRecordsCount.textContent = '0';
    DOM.navStudentCount.textContent = '0';
    return;
  }

  // Total
  DOM.statTotalStudents.textContent = total.toLocaleString();
  DOM.totalRecordsCount.textContent = total.toLocaleString();
  DOM.navStudentCount.textContent = total.toLocaleString();

  // Average Marks
  const marksSum = students.reduce((sum, s) => sum + Number(s.marks), 0);
  const avg = marksSum / total;
  DOM.statAverageMarks.textContent = `${avg.toFixed(1)}%`;
  const avgGrade = getGradeInfo(avg);
  DOM.statAvgGrade.textContent = `Grade: ${avgGrade.grade} (${avgGrade.remark})`;

  // Highest Scorer
  let topStudent = students[0];
  for (let i = 1; i < students.length; i++) {
    if (Number(students[i].marks) > Number(topStudent.marks)) {
      topStudent = students[i];
    }
  }
  DOM.statHighestMarks.textContent = `${topStudent.marks} / 100`;
  DOM.statHighestScorerName.textContent = `${topStudent.name} (${topStudent.regNo})`;

  // Passed Count
  const passedStudents = students.filter(s => Number(s.marks) >= PASSING_THRESHOLD);
  const passCount = passedStudents.length;
  const passRate = ((passCount / total) * 100).toFixed(1);

  DOM.statPassedCount.textContent = `${passCount} / ${total}`;
  DOM.statPassRate.textContent = `Pass Rate: ${passRate}%`;
}

// =============================================================================
// 5. Data Filtering, Sorting & Rendering
// =============================================================================

/**
 * Filter students according to current UI inputs
 */
function getFilteredAndSortedStudents() {
  const searchTerm = DOM.searchInput.value.trim().toLowerCase();
  const selectedDept = DOM.deptFilter.value;
  const selectedYear = DOM.yearFilter.value;
  const selectedStatus = DOM.statusFilter.value;
  const sortMode = DOM.sortBySelect.value;

  // Filter
  let result = students.filter(student => {
    // Search match (Name or Register Number)
    const matchesSearch = !searchTerm ||
      student.name.toLowerCase().includes(searchTerm) ||
      student.regNo.toLowerCase().includes(searchTerm);

    // Department match
    const matchesDept = selectedDept === 'all' || student.department === selectedDept;

    // Year match
    const matchesYear = selectedYear === 'all' || student.year === selectedYear;

    // Status match
    const isPassed = Number(student.marks) >= PASSING_THRESHOLD;
    let matchesStatus = true;
    if (selectedStatus === 'pass') matchesStatus = isPassed;
    if (selectedStatus === 'fail') matchesStatus = !isPassed;

    return matchesSearch && matchesDept && matchesYear && matchesStatus;
  });

  // Sort
  result.sort((a, b) => {
    switch (sortMode) {
      case 'name-asc':
        return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
      case 'name-desc':
        return b.name.localeCompare(a.name, undefined, { sensitivity: 'base' });
      case 'reg-asc':
        return a.regNo.localeCompare(b.regNo, undefined, { numeric: true, sensitivity: 'base' });
      case 'reg-desc':
        return b.regNo.localeCompare(a.regNo, undefined, { numeric: true, sensitivity: 'base' });
      case 'marks-desc':
        return Number(b.marks) - Number(a.marks);
      case 'marks-asc':
        return Number(a.marks) - Number(b.marks);
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return result;
}

/**
 * Render table rows based on current filtered records
 */
function renderTable() {
  const filtered = getFilteredAndSortedStudents();
  DOM.visibleRecordsCount.textContent = filtered.length;

  // Check if any filters are active
  const isFiltered = DOM.searchInput.value.trim() !== '' ||
                     DOM.deptFilter.value !== 'all' ||
                     DOM.yearFilter.value !== 'all' ||
                     DOM.statusFilter.value !== 'all';

  if (DOM.filterActiveIndicator) {
    DOM.filterActiveIndicator.style.display = isFiltered ? 'inline-block' : 'none';
  }

  // Clear search button visibility
  if (DOM.clearSearchBtn) {
    DOM.clearSearchBtn.style.display = DOM.searchInput.value ? 'block' : 'none';
  }

  // Handle Empty State
  if (filtered.length === 0) {
    DOM.studentTable.style.display = 'none';
    DOM.emptyState.style.display = 'flex';

    if (students.length === 0) {
      DOM.emptyStateTitle.textContent = 'No Students in Database';
      DOM.emptyStateMessage.textContent = 'Your student directory is currently empty. Add your first student or restore sample records to get started.';
      DOM.emptyClearFiltersBtn.textContent = 'Restore Sample Data';
      DOM.emptyClearFiltersBtn.onclick = () => restoreSampleData();
    } else {
      DOM.emptyStateTitle.textContent = 'No matching records found';
      DOM.emptyStateMessage.textContent = `No students match the criteria "${DOM.searchInput.value || 'applied filters'}". Try resetting filters.`;
      DOM.emptyClearFiltersBtn.textContent = 'Clear Search & Filters';
      DOM.emptyClearFiltersBtn.onclick = () => resetAllFilters();
    }
    return;
  }

  // Show table and populate rows
  DOM.emptyState.style.display = 'none';
  DOM.studentTable.style.display = 'table';

  const rowsHtml = filtered.map(student => {
    const gradeInfo = getGradeInfo(student.marks);
    const deptClass = getDeptBadgeClass(student.department);
    const initials = getInitials(student.name);
    const avatarGradient = generateAvatarGradient(student.name);
    const isPassed = Number(student.marks) >= PASSING_THRESHOLD;

    // Progress bar color based on score
    let progressColor = '#10b981'; // Green
    if (student.marks < 50) progressColor = '#ef4444'; // Red
    else if (student.marks < 75) progressColor = '#f59e0b'; // Amber

    return `
      <tr data-reg="${escapeHtml(student.regNo)}">
        <!-- Register Number -->
        <td>
          <span class="reg-no-code">${escapeHtml(student.regNo)}</span>
        </td>

        <!-- Student Profile -->
        <td>
          <div class="student-profile-cell" onclick="viewStudentRecord('${escapeHtml(student.regNo)}')">
            <div class="student-avatar" style="background: ${avatarGradient};">
              ${initials}
            </div>
            <div class="student-meta-info">
              <span class="student-meta-name" title="Click to view details">${escapeHtml(student.name)}</span>
              <span class="student-meta-email">${escapeHtml(student.email)}</span>
            </div>
          </div>
        </td>

        <!-- Department -->
        <td>
          <span class="badge ${deptClass}">${escapeHtml(student.department)}</span>
        </td>

        <!-- Academic Year -->
        <td>
          <span class="year-tag">${escapeHtml(student.year)}</span>
        </td>

        <!-- Marks & Grade -->
        <td>
          <div class="marks-cell">
            <div class="marks-score-row">
              <span class="marks-val">${student.marks}</span>
              <span class="grade-badge ${gradeInfo.class}">${gradeInfo.grade}</span>
            </div>
            <div class="mini-progress-bar" title="${student.marks}%">
              <div class="mini-progress-fill" style="width: ${student.marks}%; background: ${progressColor};"></div>
            </div>
          </div>
        </td>

        <!-- Status -->
        <td class="text-center">
          <span class="status-pill ${isPassed ? 'status-passed' : 'status-failed'}">
            <span class="status-dot"></span>
            ${isPassed ? 'Passed' : 'Failed'}
          </span>
        </td>

        <!-- Actions -->
        <td class="text-right">
          <div class="action-buttons-group">
            <button class="btn-icon-action" onclick="viewStudentRecord('${escapeHtml(student.regNo)}')" title="View Student Profile" aria-label="View Student Profile">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
            <button class="btn-icon-action edit-action" onclick="editStudentRecord('${escapeHtml(student.regNo)}')" title="Edit Student" aria-label="Edit Student">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button class="btn-icon-action delete-action" onclick="promptDeleteStudent('${escapeHtml(student.regNo)}')" title="Delete Student" aria-label="Delete Student">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  DOM.studentTableBody.innerHTML = rowsHtml;
}

/**
 * Safely escape string values for insertion into HTML
 */
function escapeHtml(string) {
  if (string === null || string === undefined) return '';
  return String(string)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// =============================================================================
// 6. Form Validation & Submission
// =============================================================================

/** Clear inline validation feedback */
function clearValidationErrors() {
  const errorElements = [
    DOM.regNoError,
    DOM.nameError,
    DOM.deptError,
    DOM.yearError,
    DOM.emailError,
    DOM.marksError
  ];
  errorElements.forEach(el => {
    if (el) el.textContent = '';
  });

  const formGroups = DOM.studentForm.querySelectorAll('.form-group');
  formGroups.forEach(group => group.classList.remove('has-error'));
}

/**
 * Validate all form fields and display inline error messages
 * @returns {boolean} true if valid
 */
function validateForm() {
  clearValidationErrors();
  let isValid = true;

  const regNo = DOM.regNoInput.value.trim();
  const name = DOM.nameInput.value.trim();
  const dept = DOM.deptInput.value;
  const year = DOM.yearInput.value;
  const email = DOM.emailInput.value.trim();
  const marks = DOM.marksInput.value.trim();
  const originalRegNo = DOM.formOriginalRegNo.value.trim();

  // 1. Validate Register Number
  if (!regNo) {
    showFieldError(DOM.regNoInput, DOM.regNoError, 'Register Number is required.');
    isValid = false;
  } else if (!/^[A-Za-z0-9_-]{3,20}$/.test(regNo)) {
    showFieldError(DOM.regNoInput, DOM.regNoError, 'Must be 3-20 alphanumeric characters (hyphens allowed).');
    isValid = false;
  } else {
    // Check for duplicate register number
    const isDuplicate = students.some(s => 
      s.regNo.toLowerCase() === regNo.toLowerCase() && 
      s.regNo.toLowerCase() !== originalRegNo.toLowerCase()
    );
    if (isDuplicate) {
      showFieldError(DOM.regNoInput, DOM.regNoError, `Register Number "${regNo}" is already registered.`);
      isValid = false;
    }
  }

  // 2. Validate Name
  if (!name) {
    showFieldError(DOM.nameInput, DOM.nameError, 'Full Name is required.');
    isValid = false;
  } else if (name.length < 2) {
    showFieldError(DOM.nameInput, DOM.nameError, 'Name must be at least 2 characters long.');
    isValid = false;
  } else if (!/^[A-Za-z\s.'-]+$/.test(name)) {
    showFieldError(DOM.nameInput, DOM.nameError, 'Name should contain valid letters and spaces only.');
    isValid = false;
  }

  // 3. Validate Department
  if (!dept) {
    showFieldError(DOM.deptInput, DOM.deptError, 'Please select an academic department.');
    isValid = false;
  }

  // 4. Validate Year
  if (!year) {
    showFieldError(DOM.yearInput, DOM.yearError, 'Please select the academic year.');
    isValid = false;
  }

  // 5. Validate Email
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email) {
    showFieldError(DOM.emailInput, DOM.emailError, 'Email address is required.');
    isValid = false;
  } else if (!emailPattern.test(email)) {
    showFieldError(DOM.emailInput, DOM.emailError, 'Please enter a valid email address (e.g., student@domain.com).');
    isValid = false;
  }

  // 6. Validate Marks
  if (marks === '') {
    showFieldError(DOM.marksInput, DOM.marksError, 'Marks are required.');
    isValid = false;
  } else {
    const marksNum = Number(marks);
    if (isNaN(marksNum) || marksNum < 0 || marksNum > 100) {
      showFieldError(DOM.marksInput, DOM.marksError, 'Marks must be a number between 0 and 100.');
      isValid = false;
    }
  }

  return isValid;
}

function showFieldError(inputElement, errorElement, message) {
  if (errorElement) errorElement.textContent = message;
  const parentGroup = inputElement.closest('.form-group');
  if (parentGroup) parentGroup.classList.add('has-error');
}

/**
 * Handle Add/Edit Form submission
 */
function handleFormSubmit(e) {
  e.preventDefault();

  if (!validateForm()) {
    showToast('Please fix the errors in the form before submitting.', 'error');
    return;
  }

  const regNo = DOM.regNoInput.value.trim().toUpperCase();
  const name = DOM.nameInput.value.trim();
  const dept = DOM.deptInput.value;
  const year = DOM.yearInput.value;
  const email = DOM.emailInput.value.trim().toLowerCase();
  const marks = Math.round(Number(DOM.marksInput.value));
  const originalRegNo = DOM.formOriginalRegNo.value.trim();

  const isEditing = Boolean(originalRegNo);

  if (isEditing) {
    // Find index of record being updated
    const index = students.findIndex(s => s.regNo.toLowerCase() === originalRegNo.toLowerCase());
    if (index !== -1) {
      students[index] = {
        regNo,
        name,
        department: dept,
        year,
        email,
        marks
      };
      saveStudentsToStorage();
      updateDashboardStats();
      renderTable();
      closeModal(DOM.studentModal);
      showToast(`Student record "${name}" updated successfully!`, 'success');
    } else {
      showToast('Error: Target student record could not be found.', 'error');
    }
  } else {
    // Add new student
    const newStudent = {
      regNo,
      name,
      department: dept,
      year,
      email,
      marks
    };

    students.unshift(newStudent);
    saveStudentsToStorage();
    updateDashboardStats();
    renderTable();
    closeModal(DOM.studentModal);
    showToast(`Student "${name}" added successfully!`, 'success');
  }
}

// =============================================================================
// 7. Modals Control (Add, Edit, View, Delete, Clear)
// =============================================================================

function openModal(modalElement) {
  if (!modalElement) return;
  modalElement.classList.add('active');
  modalElement.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal(modalElement) {
  if (!modalElement) return;
  modalElement.classList.remove('active');
  modalElement.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/** Open modal for adding a new student */
function openAddStudentModal() {
  DOM.studentForm.reset();
  DOM.formOriginalRegNo.value = '';
  DOM.modalTitle.textContent = 'Add New Student';
  DOM.modalSubtitle.textContent = 'Fill in student details below. All fields are mandatory.';
  DOM.saveBtnText.textContent = 'Save Student';
  DOM.marksPreviewBadge.textContent = 'Score: --';
  clearValidationErrors();
  openModal(DOM.studentModal);
  DOM.regNoInput.focus();
}

/** Open modal to edit student */
window.editStudentRecord = function(regNo) {
  const student = students.find(s => s.regNo.toLowerCase() === regNo.toLowerCase());
  if (!student) {
    showToast('Record not found', 'error');
    return;
  }

  // Pre-fill form fields
  DOM.formOriginalRegNo.value = student.regNo;
  DOM.regNoInput.value = student.regNo;
  DOM.nameInput.value = student.name;
  DOM.deptInput.value = student.department;
  DOM.yearInput.value = student.year;
  DOM.emailInput.value = student.email;
  DOM.marksInput.value = student.marks;

  // Update Preview Badge
  updateMarksPreview(student.marks);

  DOM.modalTitle.textContent = 'Edit Student Record';
  DOM.modalSubtitle.textContent = `Updating record for ${student.name} (${student.regNo})`;
  DOM.saveBtnText.textContent = 'Update Student';
  clearValidationErrors();

  closeModal(DOM.viewModal);
  openModal(DOM.studentModal);
};

/** Quick-view student profile card */
window.viewStudentRecord = function(regNo) {
  const student = students.find(s => s.regNo.toLowerCase() === regNo.toLowerCase());
  if (!student) return;

  const gradeInfo = getGradeInfo(student.marks);
  const initials = getInitials(student.name);

  DOM.viewAvatar.textContent = initials;
  DOM.viewAvatar.style.background = generateAvatarGradient(student.name);
  DOM.viewStudentName.textContent = student.name;
  DOM.viewRegNo.textContent = student.regNo;
  DOM.viewEmail.textContent = student.email;
  DOM.viewDept.textContent = student.department;
  DOM.viewYear.textContent = student.year;
  
  const isPassed = Number(student.marks) >= PASSING_THRESHOLD;
  DOM.viewStatusBadge.innerHTML = `
    <span class="status-pill ${isPassed ? 'status-passed' : 'status-failed'}">
      <span class="status-dot"></span>
      ${isPassed ? 'Passed' : 'Failed'}
    </span>
  `;

  DOM.viewGradeBadge.textContent = `Grade ${gradeInfo.grade}`;
  DOM.viewProgressBar.style.width = `${student.marks}%`;
  DOM.viewMarksScore.textContent = `${student.marks} / 100`;
  DOM.viewScoreRemark.textContent = gradeInfo.remark;
  DOM.viewScoreRemark.style.color = isPassed ? '#10b981' : '#ef4444';

  DOM.editFromViewBtn.onclick = () => {
    editStudentRecord(student.regNo);
  };

  openModal(DOM.viewModal);
};

/** Prompt confirmation dialog before deleting student */
window.promptDeleteStudent = function(regNo) {
  const student = students.find(s => s.regNo.toLowerCase() === regNo.toLowerCase());
  if (!student) return;

  deleteTargetRegNo = student.regNo;
  DOM.deleteStudentName.textContent = student.name;
  DOM.deleteStudentReg.textContent = student.regNo;

  openModal(DOM.deleteModal);
};

/** Confirm delete target student */
function confirmDelete() {
  if (!deleteTargetRegNo) return;

  const target = students.find(s => s.regNo === deleteTargetRegNo);
  const targetName = target ? target.name : deleteTargetRegNo;

  students = students.filter(s => s.regNo !== deleteTargetRegNo);
  saveStudentsToStorage();
  updateDashboardStats();
  renderTable();

  closeModal(DOM.deleteModal);
  deleteTargetRegNo = null;

  showToast(`Record for "${targetName}" deleted successfully.`, 'info');
}

/** Clear all records */
function promptClearAll() {
  if (students.length === 0) {
    showToast('There are no records to clear.', 'warning');
    return;
  }
  openModal(DOM.clearAllModal);
}

function confirmClearAll() {
  students = [];
  saveStudentsToStorage();
  updateDashboardStats();
  renderTable();
  closeModal(DOM.clearAllModal);
  showToast('All student records have been wiped from local storage.', 'warning');
}

/** Reset to default sample records */
function restoreSampleData() {
  students = JSON.parse(JSON.stringify(INITIAL_SAMPLE_STUDENTS));
  saveStudentsToStorage();
  resetAllFilters();
  updateDashboardStats();
  renderTable();
  showToast('Restored default sample student records.', 'success');
}

/** Live update of marks badge preview */
function updateMarksPreview(marksVal) {
  if (marksVal === '' || isNaN(marksVal)) {
    DOM.marksPreviewBadge.textContent = 'Score: --';
    return;
  }
  const gradeInfo = getGradeInfo(marksVal);
  DOM.marksPreviewBadge.textContent = `Grade: ${gradeInfo.grade} (${gradeInfo.passed ? 'Pass' : 'Fail'})`;
}

// =============================================================================
// 8. Search & Filter Resets
// =============================================================================

function resetAllFilters() {
  DOM.searchInput.value = '';
  DOM.deptFilter.value = 'all';
  DOM.yearFilter.value = 'all';
  DOM.statusFilter.value = 'all';
  DOM.sortBySelect.value = 'name-asc';
  updateTableSortIndicators(null, null);
  renderTable();
}

// Table column header sort toggle
function handleHeaderSort(column) {
  if (currentSortColumn === column) {
    currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    currentSortColumn = column;
    currentSortDirection = 'asc';
  }

  // Update select dropdown value to reflect header sort
  let selectVal = 'name-asc';
  if (column === 'name') selectVal = currentSortDirection === 'asc' ? 'name-asc' : 'name-desc';
  else if (column === 'reg') selectVal = currentSortDirection === 'asc' ? 'reg-asc' : 'reg-desc';
  else if (column === 'marks') selectVal = currentSortDirection === 'asc' ? 'marks-asc' : 'marks-desc';

  DOM.sortBySelect.value = selectVal;
  updateTableSortIndicators(column, currentSortDirection);
  renderTable();
}

function updateTableSortIndicators(activeCol, direction) {
  const headers = document.querySelectorAll('.th-sortable');
  headers.forEach(h => {
    h.classList.remove('sorted-asc', 'sorted-desc');
    const col = h.getAttribute('data-sort');
    if (col === activeCol) {
      h.classList.add(direction === 'asc' ? 'sorted-asc' : 'sorted-desc');
    }
  });
}

// =============================================================================
// 9. Toast Notification System
// =============================================================================

/**
 * Display toast message with automatic slide-out and cleanup
 * @param {string} message - Message text
 * @param {'success'|'error'|'warning'|'info'} type - Toast type
 * @param {number} duration - Milliseconds before auto-dismiss
 */
function showToast(message, type = 'info', duration = 3500) {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  // Select appropriate icon
  let iconSvg = '';
  if (type === 'success') {
    iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
  } else if (type === 'error') {
    iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
  } else if (type === 'warning') {
    iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
  } else {
    iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
  }

  const titleText = type.charAt(0).toUpperCase() + type.slice(1);

  toast.innerHTML = `
    <div class="toast-icon">${iconSvg}</div>
    <div class="toast-body">
      <div class="toast-title">${titleText}</div>
      <div class="toast-message">${escapeHtml(message)}</div>
    </div>
    <button class="toast-close" aria-label="Dismiss toast">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
    <div class="toast-timer" style="animation-duration: ${duration}ms;"></div>
  `;

  DOM.toastContainer.appendChild(toast);

  const dismiss = () => {
    toast.classList.add('toast-hide');
    setTimeout(() => {
      if (toast.parentElement) toast.parentElement.removeChild(toast);
    }, 250);
  };

  toast.querySelector('.toast-close').addEventListener('click', dismiss);
  setTimeout(dismiss, duration);
}

// =============================================================================
// 10. Data Export (CSV)
// =============================================================================

/**
 * Export current list of students to downloadable CSV
 */
function exportToCSV() {
  const currentList = getFilteredAndSortedStudents();
  if (currentList.length === 0) {
    showToast('No students available to export.', 'warning');
    return;
  }

  const headers = ['Register Number', 'Student Name', 'Department', 'Academic Year', 'Email', 'Marks', 'Grade', 'Status'];
  const rows = currentList.map(s => {
    const gradeInfo = getGradeInfo(s.marks);
    const status = Number(s.marks) >= PASSING_THRESHOLD ? 'Passed' : 'Failed';
    return [
      `"${s.regNo}"`,
      `"${s.name.replace(/"/g, '""')}"`,
      `"${s.department}"`,
      `"${s.year}"`,
      `"${s.email}"`,
      s.marks,
      `"${gradeInfo.grade}"`,
      `"${status}"`
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);

  downloadLink.href = url;
  downloadLink.setAttribute('download', `EduTrack_Student_Records_${dateStr}.csv`);
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);

  showToast(`Exported ${currentList.length} student records to CSV.`, 'success');
}

// =============================================================================
// 11. Event Listeners & Binding
// =============================================================================

function setupEventListeners() {
  // Add student modal triggers
  DOM.openAddModalBtn.addEventListener('click', openAddStudentModal);
  DOM.sidebarAddStudentBtn.addEventListener('click', () => {
    openAddStudentModal();
    closeSidebar();
  });
  DOM.emptyAddStudentBtn.addEventListener('click', openAddStudentModal);

  // Close modal buttons
  DOM.closeModalBtn.addEventListener('click', () => closeModal(DOM.studentModal));
  DOM.cancelModalBtn.addEventListener('click', () => closeModal(DOM.studentModal));

  // Form submit
  DOM.studentForm.addEventListener('submit', handleFormSubmit);

  // Live input formatting / marks preview
  DOM.marksInput.addEventListener('input', (e) => {
    updateMarksPreview(e.target.value);
  });

  // Real-time error dismissal on typing
  DOM.studentForm.querySelectorAll('input, select').forEach(field => {
    field.addEventListener('input', () => {
      const group = field.closest('.form-group');
      if (group && group.classList.contains('has-error')) {
        group.classList.remove('has-error');
        const errSpan = group.querySelector('.field-error');
        if (errSpan) errSpan.textContent = '';
      }
    });
  });

  // Delete modal actions
  DOM.confirmDeleteBtn.addEventListener('click', confirmDelete);
  DOM.cancelDeleteBtn.addEventListener('click', () => closeModal(DOM.deleteModal));

  // Clear all actions
  DOM.btnClearAllRecords.addEventListener('click', promptClearAll);
  DOM.confirmClearAllBtn.addEventListener('click', confirmClearAll);
  DOM.cancelClearAllBtn.addEventListener('click', () => closeModal(DOM.clearAllModal));

  // Reset sample records buttons
  DOM.btnResetSampleData.addEventListener('click', restoreSampleData);
  DOM.sidebarResetBtn.addEventListener('click', () => {
    restoreSampleData();
    closeSidebar();
  });

  // Profile View modal close
  DOM.closeViewModalBtn.addEventListener('click', () => closeModal(DOM.viewModal));
  DOM.closeViewBtn.addEventListener('click', () => closeModal(DOM.viewModal));

  // Close modals when clicking backdrop
  [DOM.studentModal, DOM.deleteModal, DOM.clearAllModal, DOM.viewModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });
  });

  // Escape key closes open modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      [DOM.studentModal, DOM.deleteModal, DOM.clearAllModal, DOM.viewModal].forEach(closeModal);
    }
  });

  // Search input
  DOM.searchInput.addEventListener('input', renderTable);
  DOM.clearSearchBtn.addEventListener('click', () => {
    DOM.searchInput.value = '';
    DOM.searchInput.focus();
    renderTable();
  });

  // Filter and sort controls
  DOM.deptFilter.addEventListener('change', renderTable);
  DOM.yearFilter.addEventListener('change', renderTable);
  DOM.statusFilter.addEventListener('change', renderTable);
  DOM.sortBySelect.addEventListener('change', (e) => {
    // Sync table headers
    const val = e.target.value;
    if (val.startsWith('name')) updateTableSortIndicators('name', val.endsWith('asc') ? 'asc' : 'desc');
    else if (val.startsWith('reg')) updateTableSortIndicators('reg', val.endsWith('asc') ? 'asc' : 'desc');
    else if (val.startsWith('marks')) updateTableSortIndicators('marks', val.endsWith('asc') ? 'asc' : 'desc');
    renderTable();
  });

  DOM.resetFiltersBtn.addEventListener('click', resetAllFilters);

  // Table column headers sortable click
  document.querySelectorAll('.th-sortable').forEach(header => {
    header.addEventListener('click', () => {
      const sortCol = header.getAttribute('data-sort');
      handleHeaderSort(sortCol);
    });
  });

  // Export buttons
  DOM.quickExportBtn.addEventListener('click', exportToCSV);
  DOM.sidebarExportBtn.addEventListener('click', () => {
    exportToCSV();
    closeSidebar();
  });

  // Mobile sidebar controls
  DOM.hamburgerBtn.addEventListener('click', openSidebar);
  DOM.sidebarCloseBtn.addEventListener('click', closeSidebar);
  DOM.sidebarOverlay.addEventListener('click', closeSidebar);

  // Dark / Light Theme Toggle
  DOM.themeToggleBtn.addEventListener('click', toggleTheme);
}

function openSidebar() {
  DOM.sidebar.classList.add('open');
  DOM.sidebarOverlay.classList.add('active');
}

function closeSidebar() {
  DOM.sidebar.classList.remove('open');
  DOM.sidebarOverlay.classList.remove('active');
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const newTheme = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem(THEME_KEY, newTheme);
  showToast(`Switched to ${newTheme} mode`, 'info', 2000);
}

// =============================================================================
// 12. Application Bootstrapping
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
  initSystemSettings();
  loadStudents();
  setupEventListeners();
  updateDashboardStats();
  renderTable();

  // Indicate system ready
  console.log('EduTrack Dashboard loaded successfully. Total students:', students.length);
});
