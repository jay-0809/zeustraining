interface CourseCard {
    img: string;
    title: string;
    meta: string;
    grade: number;
    inc: number;
    units?: number;
    lessons?: number;
    topics?: number;
    classes: string[];
    students_no?: number;
    date?: string;
    courseAct: boolean;
    star?: boolean;
    expired?: boolean;
}

interface CourseAction {
    url: string;
    special?: boolean;
}

interface AlertItem {
    title: string;
    img: 'minus' | 'correct';
    date: string;
    course?: string;
}

interface AnnouncementItem {
    name: string;
    img: 'minus' | 'correct';
    announce: string;
    files?: string;
    course?: string;
    date: string;
}

const card_data: CourseCard[] = [{
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
    classes: [
    ],
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

const courseActions: CourseAction[] = [
    { url: "asset/icons/preview.svg", special: false },
    {
        url: "asset/icons/manage-course.svg",
        special: true
    },
    { url: "asset/icons/grade-submissions.svg", special: true },
    { url: "asset/icons/reports.svg", special: false },
];

const alert_data: AlertItem[] = [{
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

const announcement_data: AnnouncementItem[] = [{
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


const showAllCards = (): void => {
    const coursesGrid = document.querySelector(".courses-grid");
    if (!coursesGrid) return;

    card_data.forEach(card => {
        const courseCard = document.createElement("div");
        courseCard.className = "course-card";

        const classOptions = card.classes.length > 0
            ? card.classes.map(c => `<option value='${c}'>${c}</option>`).join("")
            : `<option value='No Classes'>No Classes</option>`;

        const courseActionsHTML = courseActions.map(action =>
            `<img src=${action.url} alt="." ${card.courseAct && action.special ? "style='opacity: 40%;'" : ""}> `
        ).join("");

        courseCard.innerHTML = `
            ${card.expired ? '<div class="expired-badge">Expired</div>' : ""}
            <div class="course-content">
                <img src=${card.img} class="course-image" alt="imageMask" />
                <div class="course-info">
                    <div class="course-header">
                        <div class="course-title" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis;">${card.title}</div>
                        <div class="course-meta">${card.meta}
                            <div style="display:flex; padding-left: 9px; border-left: 1px solid #d1d1d1;">Grade ${card.grade}
                                <div style="padding-left: 2px; color: #1F7A54;">+${card.inc}</div>
                            </div>
                        </div>
                        <div class="course-stats">
                            ${card.units ? `<span><b>${card.units}</b> Units</span>` : ``}
                            ${card.lessons ? `<span><b>${card.lessons}</b> Lessons</span>` : ``}
                            ${card.topics ? `<span><b>${card.topics}</b> Topics</span>` : ``}
                        </div>
                    </div>
                    <div>
                        <select name="course" class="course-class ${card.classes.length === 0 ? 'no-classes' : ''}">
                            ${classOptions}
                        </select>
                        <div class="course-class-info">
                            ${card.students_no ? `<span>${card.students_no} Students</span>` : ``}
                            ${card.date ? `<span style="padding-left: 8px; border-left: 1px solid #d1d1d1;">${card.date}</span>` : ``}
                        </div>
                    </div>
                </div>
                <div class="star-icon">
                    ${card.star ? '<img src="asset/icons/favourite-gray.svg" alt="fav">' : '<img src="asset/icons/favourite.svg" alt="fav">'}
                </div>
            </div>
            <div class="course-line"></div>
            <div class="course-actions">${courseActionsHTML}</div>
        `;
        coursesGrid.append(courseCard);
    });
};

const showAlerts = (): void => {
    const alertBox = document.querySelector(".alert-box");
    if (!alertBox) return;

    alert_data.forEach(alert => {
        const alertItems = document.createElement("div");
        alertItems.className = "alert-items";
        if (alert.img === "minus") {
            alertItems.style.background = "#FFFFEE 0% 0% no-repeat padding-box";
        }

        alertItems.innerHTML = `
            <div style="display: flex; justify-content: space-between; font-size: 12px;">
                <div style="font-size: 14px;">${alert.title}</div>
                <div><img src="asset/icons/${alert.img}.png" alt="${alert.img}" style="height: 15px; width: 15px;" /></div>
            </div>
            ${alert.course ? `<div style="font-size: 12px;"><span style="color: #6E6E6E;">Course: </span>${alert.course}</div>` : ``}
            <div style="display: flex; color: #6E6E6E; gap: 4px; font-size: 12px;">
                <span style="margin-left: auto;">${alert.date}</span>
            </div>
        `;
        alertBox.append(alertItems);
    });

    const alertBtn = document.createElement("div");
    alertBtn.className = "alert-button";
    alertBtn.innerHTML = `<button>Show All</button>`;
    alertBox.append(alertBtn);
};

const showAnnouncements = (): void => {
    const announceBox = document.querySelector(".announce-box");
    if (!announceBox) return;

    announcement_data.forEach(announcement => {
        const announceItems = document.createElement("div");
        announceItems.className = "announce-items";
        if (announcement.img === "minus") {
            announceItems.style.background = "#FFFFEE 0% 0% no-repeat padding-box";
        }

        announceItems.innerHTML = `
            <div style="display: flex; justify-content: space-between; font-size: 12px;">
                <div><span style="color: #6E6E6E;">PA: </span>${announcement.name}</div>
                <div><img src="asset/icons/${announcement.img}.png" alt="${announcement.img}" style="height: 15px; width: 15px;" /></div>
            </div>
            <div style="font-size: 14px;">${announcement.announce}</div>
            ${announcement.course ? `<div style="color: #6E6E6E; font-size: 12px;">${announcement.course}</div>` : ``}
            <div style="display: flex; justify-content: space-between; color: #6E6E6E; font-size: 12px;">
                ${announcement.files ? `
                    <div>
                        <span><img src="asset/icons/attach.png" alt="attach" style="height: 13px; width: 13px;" /></span>
                        <span>${announcement.files}</span>
                    </div>
                ` : ``}
                <span style="margin-left: auto;">${announcement.date}</span>
            </div>
        `;
        announceBox.append(announceItems);
    });

    const announceBtn = document.createElement("div");
    announceBtn.className = "announce-buttons";
    announceBtn.innerHTML = `
        <button>Show All</button>
        <div style="border-left: 1px solid #0000001F; opacity: 1; padding: 20px 0;"></div>
        <button>Create New</button>`;
    announceBox.append(announceBtn);
};

document.addEventListener('DOMContentLoaded', () => {
    showAllCards();
    showAlerts();
    showAnnouncements();
});
