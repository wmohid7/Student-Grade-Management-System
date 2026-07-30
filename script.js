let students = JSON.parse(localStorage.getItem("students")) || []; 
 let editIndex = -1;  


const nameInput = document.getElementById("name");
const rollInput = document.getElementById("roll");
const marksInput = document.getElementById("marks");
const addBtn = document.getElementById("addBtn");      
const tableBody = document.getElementById("studentTable");
const searchInput = document.getElementById("search");

addBtn.addEventListener("click", addOrUpdateStudent); 
searchInput.addEventListener("keyup", searchStudents);

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

    const duplicate = students.find((student, index) =>
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
    }; //student object

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

    tableBody.innerHTML = ""; 

    // Bonus Feature 
    
    if (list.length === 0) {
        tableBody.innerHTML = `
        
        <tr> 

        <td colspan="6" class="empty-state">

        No Student Record Found.

        </td?

        </tr>
        
        `;

        return;
    }

            //  Bonus feature 
    const highestMarks = Math.max(...students.map(student => student.marks))

                                   
    list.forEach((student, index) => {

        tableBody.innerHTML += `
        <tr class="${student.marks === highestMarks ? "topper" : ""}">
            <td>${student.roll}</td>
            <td>${student.name}</td>
            <td>${student.marks}</td>
            <td>${student.grade}</td>
            <td>${student.status}</td>

            <td>

                <button onclick="editStudent(${index})">
                Edit
                </button>

                <button onclick="deleteStudent(${index})">
                Delete
                </button>

            </td>

        </tr>
        `;
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

function SortMarksAsc() {

    students.sort((a, b) => a.marks - b.marks); 

    displayStudents(students);
    saveToLocalStorage();
}

function SortMarksDesc() {

    students.sort((a, b) => b.marks - a.marks); 
    displayStudents(students);
    saveToLocalStorage();
}

function SortName() {    

    students.sort((a, b) => a.name.localeCompare(b.name));

    displayStudents(students);
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

    document.getElementById("TOTAL").textContent = students.length;

    if (students.length === 0) {

        document.getElementById("AVERAGE").textContent = 0; 
        document.getElementById("HIGHEST").textContent = 0;
        document.getElementById("LOWEST").textContent = 0;
        document.getElementById("PASSED").textContent = 0;
        document.getElementById("FAILED").textContent = 0;

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

displayStudents(students);

updateDashboard();