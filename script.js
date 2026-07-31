let students = JSON.parse(localStorage.getItem("students")) || [];
let editIndex = -1;


const nameInput = document.getElementById("name");
const rollInput = document.getElementById("roll");
const marksInput = document.getElementById("marks");
const addBtn = document.getElementById("addBtn");
const tableBody = document.getElementById("studentTable");
const searchInput = document.getElementById("search");


document.getElementById("TOTAL").textContent = students.length;
document.getElementById("AVERAGE").textContent = 0;
document.getElementById("HIGHEST").textContent = 0;
document.getElementById("LOWEST").textContent = 0;
document.getElementById("PASSED").textContent = 0;
document.getElementById("FAILED").textContent = 0;


addBtn.addEventListener("click", addOrUpdateStudent);
searchInput.addEventListener("keyup", searchStudents);

function refresh(list = students) {
    saveToLocalStorage();
    displayStudents(list);
    updateDashboard();
}

function addOrUpdateStudent() {

    const name = nameInput.value.trim();
    const roll = rollInput.value.trim();
    const marks = Number(marksInput.value);

    if (name === "" || roll === "" || marksInput.value === "") {
        alert("Please fill all fields.");
        return;
    }

    if (marks < 0 || marks > 100) {
        alert("Marks must be between 0 and 100.");
        return;
    }

    const duplicate = students.some((student, index) =>
        student.roll === roll && index !== editIndex
    );

    if (duplicate) {
        alert("Roll Number already exists.");
        return;
    }

    const student = {
        name,
        roll,
        marks,
        grade: getGrade(marks),
        status: marks >= 60 ? "Pass" : "Fail"
    };

    if (editIndex === -1) {
        students.push(student);
    } else {
        students[editIndex] = student;
        editIndex = -1;
        addBtn.textContent = "Add Student";
    }
    saveToLocalStorage();
    clearForm();
    displayStudents(students);
    updateDashboard();
}

function getGrade(marks) {

    if (marks >= 90) return "A";
    if (marks >= 80) return "B";
    if (marks >= 70) return "C";
    if (marks >= 60) return "D";

    return "F";
}

function displayStudents(list) {

    tableBody.textContent = "";

    // Bonus Feature

    if (list.length === 0) {

        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 6;
        cell.className = "empty-state";
        cell.textContent = "No Student Record Found.";

        row.appendChild(cell);
        tableBody.appendChild(row);

        return;
    }

    // Bonus Feature
    const highestMarks = Math.max(...students.map(student => student.marks));

    list.forEach((student, index) => {

        // Create Row
        const row = document.createElement("tr");

        if (student.marks === highestMarks) {
            row.classList.add("topper");
        }

        // Roll Number
        const rollCell = document.createElement("td");
        rollCell.textContent = student.roll;

        // Student Name
        const nameCell = document.createElement("td");
        nameCell.textContent = student.name;

        // Marks
        const marksCell = document.createElement("td");
        marksCell.textContent = student.marks;

        // Grade
        const gradeCell = document.createElement("td");
        gradeCell.textContent = student.grade;

        // Status
        const statusCell = document.createElement("td");
        statusCell.textContent = student.status;

        // Actions
        const actionCell = document.createElement("td");

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.onclick = function () {
            editStudent(index);
        };

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = function () {
            deleteStudent(index);
        };

        actionCell.appendChild(editButton);
        actionCell.appendChild(deleteButton);

        // Add all cells to the row
        row.appendChild(rollCell);
        row.appendChild(nameCell);
        row.appendChild(marksCell);
        row.appendChild(gradeCell);
        row.appendChild(statusCell);
        row.appendChild(actionCell);

        // Add row to table
        tableBody.appendChild(row);
    });
}

function editStudent(index) {

    const student = students[index];

    nameInput.value = student.name;
    rollInput.value = student.roll;
    marksInput.value = student.marks;

    editIndex = index;
    addBtn.textContent = "Update Student";
}

function deleteStudent(index) {

    if (confirm("Delete this student?")) {

        students.splice(index, 1);


        saveToLocalStorage();
        displayStudents(students);
        updateDashboard();
    }
}

function searchStudents() {

    const value = searchInput.value.toLowerCase();

    const filtered = students.filter(student =>

        student.name.toLowerCase().includes(value) ||
        student.roll.toLowerCase().includes(value)

    );

    displayStudents(filtered);
}

function sortStudents(type) {

    switch (type) {

        case "MarksAsc":
            students.sort((a, b) => a.marks - b.marks);
            break;

        case "MarksDesc":
            students.sort((a, b) => b.marks - a.marks);
            break;

        case "name":
            students.sort((a, b) => a.name.localeCompare(b.name));
            break;

    }  displayStudents(students);
    saveToLocalStorage();
}

// Bonus Features 

function showAll() {

    displayStudents(students);
}


function showPassed() {

    const passedStudents = students.filter(student =>

        student.status === "Pass"
    );
    displayStudents(passedStudents);

}

function showFailed() {

    const failedStudents = students.filter(student =>
        student.status === "Fail"
    );

    displayStudents(failedStudents);
}

function updateDashboard() {

    if (students.length === 0) {

        return;
    }

    let totalMarks = 0;
    let highest = students[0].marks;
    let lowest = students[0].marks;
    let passed = 0;
    let failed = 0;

    students.forEach(student => {

        totalMarks += student.marks;

        if (student.marks > highest)
            highest = student.marks;

        if (student.marks < lowest)
            lowest = student.marks;

        if (student.marks >= 60)
            passed++;
        else
            failed++;
    });

    document.getElementById("AVERAGE").textContent =
        (totalMarks / students.length).toFixed(1);

    document.getElementById("HIGHEST").textContent = highest;
    document.getElementById("LOWEST").textContent = lowest;
    document.getElementById("PASSED").textContent = passed;
    document.getElementById("FAILED").textContent = failed;
}

// Bonus Feature 

function resetForm() {

    clearForm();
    editIndex = -1;
    addBtn.textContent = "Add Student";
}

function clearForm() {

    nameInput.value = "";
    rollInput.value = "";
    marksInput.value = "";

    nameInput.focus();
}

// Bonus Feature 

function saveToLocalStorage() {

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );
}

function handleSelection() {

    const value = document.getElementById("filterSort").value;

    switch (value) {

        case "MarksAsc":
        case "MarksDesc":
        case "name":
            sortStudents(value);
            break;

        case "all":
            showAll();
            break;

        case "Passed":
            showPassed();
            break;

        case "failed":
            showFailed();
            break;
    }
}

displayStudents(students);

updateDashboard();