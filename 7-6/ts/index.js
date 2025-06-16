var card_data = [{
    img: 'asset/images/imageMask-1.svg',
    title: 'Acceleration',
    meta: 'Physics',
    grade: 7,
    inc: 2,
    units: 4,
    lessons: 18,
    topics: 24,
    classes: [
        "Mr. Frank's Class B",
        "Mr. Frank's Class A",
        "Mr. Frank's Class C",
    ],
    students_no: 50,
    date: '21-Jan-2020 - 21-Aug-2020',
    courseAct: false,
},
{
    img: 'asset/images/imageMask-2.svg',
    title: 'Displacement, Velocity and Speed',
    meta: 'Physics 2',
    grade: 6,
    inc: 3,
    units: 2,
    lessons: 15,
    topics: 20,
    classes: [],
    courseAct: true,
},
{
    img: 'asset/images/imageMask.svg',
    title: 'Introduction to Biology: Micro organisms and how they affect the other Life Systems in En...',
    meta: 'Biology',
    grade: 4,
    inc: 1,
    units: 5,
    lessons: 16,
    topics: 22,
    classes: [
        "All Classes"
    ],
    students_no: 300,
    courseAct: true,
},
{
    img: 'asset/images/imageMask-3.svg',
    title: 'Introduction to High School Mathematics',
    meta: 'Mathematics',
    grade: 8,
    inc: 3,
    classes: [
        "Mr. Frank's Class A",
        "Mr. Frank's Class B",
        "Mr. Frank's Class C",
    ],
    students_no: 44,
    date: '14-Oct-2019 - 20-Oct-2020',
    courseAct: false,
    star: true,
    expired: true
},];

var courseActions = [
    { url: "asset/icons/preview.svg", special: false },
    {
        url: "asset/icons/manage-course.svg",
        special: true
    },
    { url: "asset/icons/grade-submissions.svg", special: true },
    { url: "asset/icons/reports.svg", special: false },
];

var alert_data = [{
    title: "License for Introduction to Algebra has been assigned to your school",
    img: "minus",
    date: "15-Sep-2018 at 07:21 pm"
},
{
    title: "Lesson 3 Practice Worksheet overdue for Amy Santiago",
    img: "correct",
    course: "Advanced Mathematics",
    date: "15-Sep-2018 at 07:21 pm"
},
{
    title: "23 new students created",
    img: "minus",
    date: "15-Sep-2018 at 07:21 pm"
},
{
    title: "15 submissions ready for evaluation",
    img: "minus",
    course: "Advanced Mathematics",
    date: "15-Sep-2018 at 07:21 pm"
},
{
    title: "License for Basic Concepts in Geometry has been assigned to your... school",
    img: "minus",
    date: "15-Sep-2018 at 07:21 pm"
},
{
    title: "Lesson 3 Practice Worksheet overdue for Sam Diego",
    img: "correct",
    course: "Advanced Mathematics",
    date: "15-Sep-2018 at 07:21 pm"
},
{
    title: "23 new students created",
    img: "minus",
    date: "15-Sep-2018 at 07:21 pm"
},];

var announcement_data = [{
    name: "Wilson Kumar",
    img: "correct",
    announce: "No classes will be held on 21st Nov",
    files: "2 files are attached",
    date: "15-Sep-2018 at 07:21 pm"
},
{
    name: "Samson White",
    img: "minus",
    announce: "Guest lecture on Geometry on 20th September",
    files: "2 files are attached",
    date: "15-Sep-2018 at 07:21 pm"
},
{
    name: "Wilson Kumar",
    img: "correct",
    announce: "Additional course materials available on request",
    course: "Course: Mathematics 101",
    date: "15-Sep-2018 at 07:21 pm"
},
{
    name: "Wilson Kumar",
    img: "minus",
    announce: "No classes will be held on 25th Dec",
    date: "15-Sep-2018 at 07:21 pm"
},
{
    name: "Wilson Kumar",
    img: "minus",
    announce: "Additional course materials available on request",
    course: "Course: Mathematics 101",
    date: "15-Sep-2018 at 07:21 pm"
},
{
    name: "Samson White",
    img: "minus",
    announce: "Guest lecture on Geometry on 20th September",
    files: "2 files are attached",
    date: "15-Sep-2018 at 07:21 pm"
},
{
    name: "Wilson Kumar",
    img: "correct",
    announce: "Additional course materials available on request",
    course: "Course: Mathematics 101",
    date: "15-Sep-2018 at 07:21 pm"
},
{
    name: "Wilson Kumar",
    img: "minus",
    announce: "No classes will be held on 25th Dec",
    date: "15-Sep-2018 at 07:21 pm"
},];

var showAllCards = function () {
    var coursesGrid = document.querySelector(".courses-grid");
    if (!coursesGrid)
        return;
    card_data.forEach(function (card) {
        var courseCard = document.createElement("div");
        courseCard.className = "course-card";
        var classOptions = card.classes.length > 0
            ? card.classes.map(function (c) { return "<option value='".concat(c, "'>").concat(c, "</option>"); }).join("")
            : "<option value='No Classes'>No Classes</option>";
        var courseActionsHTML = courseActions.map(function (action) {
            return "<img src=".concat(action.url, " alt=\".\" ").concat(card.courseAct && action.special ? "style='opacity: 40%;'" : "", "> ");
        }).join("");
        courseCard.innerHTML = "\n            ".concat(card.expired ? '<div class="expired-badge">Expired</div>' : "", "\n            <div class=\"course-content\">\n                <img src=").concat(card.img, " class=\"course-image\" alt=\"imageMask\" />\n                <div class=\"course-info\">\n                    <div class=\"course-header\">\n                        <div class=\"course-title\" style=\"display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis;\">").concat(card.title, "</div>\n                        <div class=\"course-meta\">").concat(card.meta, "\n                            <div style=\"display:flex; padding-left: 9px; border-left: 1px solid #d1d1d1;\">Grade ").concat(card.grade, "\n                                <div style=\"padding-left: 2px; color: #1F7A54;\">+").concat(card.inc, "</div>\n                            </div>\n                        </div>\n                        <div class=\"course-stats\">\n                            ").concat(card.units ? "<span><b>".concat(card.units, "</b> Units</span>") : "", "\n                            ").concat(card.lessons ? "<span><b>".concat(card.lessons, "</b> Lessons</span>") : "", "\n                            ").concat(card.topics ? "<span><b>".concat(card.topics, "</b> Topics</span>") : "", "\n                        </div>\n                    </div>\n                    <div>\n                        <select name=\"course\" class=\"course-class ").concat(card.classes.length === 0 ? 'no-classes' : '', "\">\n                            ").concat(classOptions, "\n                        </select>\n                        <div class=\"course-class-info\">\n                            ").concat(card.students_no ? "<span>".concat(card.students_no, " Students</span>") : "", "\n                            ").concat(card.date ? "<span style=\"padding-left: 8px; border-left: 1px solid #d1d1d1;\">".concat(card.date, "</span>") : "", "\n                        </div>\n                    </div>\n                </div>\n                <div class=\"star-icon\">\n                    ").concat(card.star ? '<img src="asset/icons/favourite-gray.svg" alt="fav">' : '<img src="asset/icons/favourite.svg" alt="fav">', "\n                </div>\n            </div>\n            <div class=\"course-line\"></div>\n            <div class=\"course-actions\">").concat(courseActionsHTML, "</div>\n        ");
        coursesGrid.append(courseCard);
    });
};

var showAlerts = function () {
    var alertBox = document.querySelector(".alert-box");
    if (!alertBox)
        return;
    alert_data.forEach(function (alert) {
        var alertItems = document.createElement("div");
        alertItems.className = "alert-items";
        if (alert.img === "minus") {
            alertItems.style.background = "#FFFFEE 0% 0% no-repeat padding-box";
        }
        alertItems.innerHTML = "\n            <div style=\"display: flex; justify-content: space-between; font-size: 12px;\">\n                <div style=\"font-size: 14px;\">".concat(alert.title, "</div>\n                <div><img src=\"asset/icons/").concat(alert.img, ".png\" alt=\"").concat(alert.img, "\" style=\"height: 15px; width: 15px;\" /></div>\n            </div>\n            ").concat(alert.course ? "<div style=\"font-size: 12px;\"><span style=\"color: #6E6E6E;\">Course: </span>".concat(alert.course, "</div>") : "", "\n            <div style=\"display: flex; color: #6E6E6E; gap: 4px; font-size: 12px;\">\n                <span style=\"margin-left: auto;\">").concat(alert.date, "</span>\n            </div>\n        ");
        alertBox.append(alertItems);
    });
    var alertBtn = document.createElement("div");
    alertBtn.className = "alert-button";
    alertBtn.innerHTML = "<button>Show All</button>";
    alertBox.append(alertBtn);
};
var showAnnouncements = function () {
    var announceBox = document.querySelector(".announce-box");
    if (!announceBox)
        return;
    announcement_data.forEach(function (announcement) {
        var announceItems = document.createElement("div");
        announceItems.className = "announce-items";
        if (announcement.img === "minus") {
            announceItems.style.background = "#FFFFEE 0% 0% no-repeat padding-box";
        }
        announceItems.innerHTML = "\n            <div style=\"display: flex; justify-content: space-between; font-size: 12px;\">\n                <div><span style=\"color: #6E6E6E;\">PA: </span>".concat(announcement.name, "</div>\n                <div><img src=\"asset/icons/").concat(announcement.img, ".png\" alt=\"").concat(announcement.img, "\" style=\"height: 15px; width: 15px;\" /></div>\n            </div>\n            <div style=\"font-size: 14px;\">").concat(announcement.announce, "</div>\n            ").concat(announcement.course ? "<div style=\"color: #6E6E6E; font-size: 12px;\">".concat(announcement.course, "</div>") : "", "\n            <div style=\"display: flex; justify-content: space-between; color: #6E6E6E; font-size: 12px;\">\n                ").concat(announcement.files ? "\n                    <div>\n                        <span><img src=\"asset/icons/attach.png\" alt=\"attach\" style=\"height: 13px; width: 13px;\" /></span>\n                        <span>".concat(announcement.files, "</span>\n                    </div>\n                ") : "", "\n                <span style=\"margin-left: auto;\">").concat(announcement.date, "</span>\n            </div>\n        ");
        announceBox.append(announceItems);
    });
    var announceBtn = document.createElement("div");
    announceBtn.className = "announce-buttons";
    announceBtn.innerHTML = "\n        <button>Show All</button>\n        <div style=\"border-left: 1px solid #0000001F; opacity: 1; padding: 20px 0;\"></div>\n        <button>Create New</button>";
    announceBox.append(announceBtn);
};
// Run everything on DOM ready
document.addEventListener('DOMContentLoaded', function () {
    showAllCards();
    showAlerts();
    showAnnouncements();
});
