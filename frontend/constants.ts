export const CATEGORY_GROUPS = [
    'Academic & Teaching',
    'Assessment & Evaluation',
    'Curriculum & Course Design',
    'Faculty Behavior & Support',
    'Infrastructure & Facilities',
    'Administration & Process',
    'Campus Services',
    'Student Support & Wellbeing',
    'Technology & Platforms',
    'General & Miscellaneous'
] as const;

export const CATEGORY_TYPES: Record<string, string[]> = {
    'Academic & Teaching': [
        'Teaching quality',
        'Explanation clarity',
        'Teaching speed',
        'Depth of content',
        'Examples used',
        'Doubt resolution',
        'Classroom interaction',
        'Lecture structure',
        'Presentation quality'
    ],
    'Assessment & Evaluation': [
        'Grading fairness',
        'Exam difficulty',
        'Feedback on assignments',
        'Quiz frequency',
        'Project guidelines'
    ],
    'Curriculum & Course Design': [
        'Syllabus relevance',
        'Course pacing',
        'Prerequisites alignment',
        'Practical application',
        'Reading materials'
    ],
    'Faculty Behavior & Support': [
        'Availability outside class',
        'Mentorship quality',
        'Professionalism',
        'Responsiveness to emails',
        'Encouragement'
    ],
    'Infrastructure & Facilities': [
        'Classroom condition',
        'Lab equipment',
        'Library resources',
        'Wi-Fi connectivity',
        'Restroom cleanliness'
    ],
    'Administration & Process': [
        'Registration issues',
        'Schedule conflicts',
        'Administrative delays',
        'Policy clarity',
        'Communication channels'
    ],
    'Campus Services': [
        'Cafeteria quality',
        'Transport services',
        'Security presence',
        'Hostel maintenance',
        'Medical facilities'
    ],
    'Student Support & Wellbeing': [
        'Counseling services',
        'Extracurricular activities',
        'Club support',
        'Mental health resources',
        'Peer support'
    ],
    'Technology & Platforms': [
        'Learning Management System (LMS)',
        'Portal usability',
        'Software access',
        'Online resource availability',
        'App functionality'
    ],
    'General & Miscellaneous': [
        'Suggestion',
        'Complaint',
        'Appreciation',
        'Other'
    ]
};
