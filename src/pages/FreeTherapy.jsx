import { useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const therapyOptions = [
    "Anxiety", "ADHD", "Autism / ASD", "Behavioural Challenges", "Depression",
    "Emotional Abuse / Trauma", "Learning Delays", "Relationship / Conflicts",
    "Addiction", "Dementia", "Developmental Delays", "Fears", "Impairment",
    "Intellectual Issues", "OCD", "Parenting", "Personality Disorder", "PTSD",
    "Self Esteem", "SLD", "Social Anxiety"
];

const therapyDetails = {
    "Anxiety": {
        intro:
            "Anxiety is not a life sentence—it’s a signal that your mind is asking for care. The fact that you’re here means you’ve already taken the first brave step toward healing.",
        sections: [
            {
                title: "Symptoms",
                points: [
                    "Feeling tense, nervous, or restless",
                    "Racing thoughts or constant worry",
                    "Fast heartbeat, sweating, or shaky hands",
                    "Trouble sleeping or relaxing",
                    "Difficulty concentrating",
                    "Avoiding situations out of fear"
                ]
            },
            {
                title: "Basic Strategies to Manage Anxiety",
                points: [
                    "Practice slow, deep breathing for 2–3 minutes",
                    "Stay active – light exercise daily helps calm the mind",
                    "Keep a regular sleep routine",
                    "Talk to someone you trust about your worries",
                    "Limit caffeine and alcohol",
                    "Learn relaxation skills like meditation or mindfulness",
                    "Break big tasks into smaller, doable steps"
                ]
            },
            {
                title: "Recovery Facts & Hope",
                points: [
                    "With proper therapy such as Cognitive Behavioral Therapy (CBT), 70–80% of people improve significantly",
                    "Many feel better within 6–12 sessions of counselling",
                    "Anxiety is highly treatable – the earlier you start, the faster the progress",
                    "You are not alone – millions recover and live normal, happy lives"
                ]
            },
        ]
    }
    ,
    "Addiction": {
        intro: "Addiction is not a weakness—it’s a challenge that can be overcome. Every small step you take counts. Recovery is real, and many live happy, free lives after counselling. ",
        sections: [
            {
                title: "Symptoms", points: [
                    "Increasing forgetfulness or memory loss",
                    "Confusion about time, place, or familiar people ",
                    "Trouble with daily activities (managing money, cooking, dressing)",
                    "Difficulty speaking or finding the right words",
                    "Changes in mood, personality, or behaviour"
                ]
            },
            {
                title: "Basic Strategies", points: [
                    "Get an early diagnosis – it helps in planning and slowing decline",
                    "Engage in memory exercises, puzzles, and meaningful activities",
                    "Maintain a structured daily routine for comfort and stability",
                    "Provide family counselling for guidance and support",
                    "Follow doctor’s advice for medicines and therapy "
                ]
            },
            {
                title: "Recovery & Hope", points: [
                    "Dementia cannot be fully cured, but early support slows progress ",
                    "Therapy, activities, and family involvement improve daily living quality ",
                    "Many people with dementia continue to enjoy meaningful life experiences ",
                    "Support for families reduces stress and builds coping strength"
                ]
            }
        ]
    },
    "Dementia": {
        "intro": "Dementia does not erase dignity or worth. With love, therapy, and support, people with dementia can live safer, more comfortable, and more fulfilling lives. Families are not alone—help is available.",
        "sections": [
            {
                "title": "Symptoms",
                "points": [
                    "Increasing forgetfulness or memory loss",
                    "Confusion about time, place, or familiar people",
                    "Trouble with daily activities (managing money, cooking, dressing)",
                    "Difficulty speaking or finding the right words",
                    "Changes in mood, personality, or behaviour"
                ]
            },
            {
                "title": "Basic Strategies to Manage Dementia",
                "points": [
                    "Get an early diagnosis – it helps in planning and slowing decline",
                    "Engage in memory exercises, puzzles, and meaningful activities",
                    "Maintain a structured daily routine for comfort and stability",
                    "Encourage social interaction and light physical activity",
                    "Provide family counselling for guidance and support",
                    "Follow doctor’s advice for medicines and therapy"
                ]
            },
            {
                "title": "Recovery Facts & Hope",
                "points": [
                    "Dementia cannot be fully cured, but early support slows progress",
                    "Therapy, activities, and family involvement improve daily living quality",
                    "Many people with dementia continue to enjoy meaningful life experiences",
                    "Support for families reduces stress and builds coping strength"
                ]
            }
        ]
    },
    "Developmental Delays": {
        "intro": "Every child grows at their own pace — some may take a little longer, and that’s okay. With timely support, therapy, and encouragement, children with developmental delays can learn, grow, and thrive with confidence.",
        "sections": [
            {
                "title": "Symptoms",
                "points": [
                    "Child is late in walking, talking, or toilet training",
                    "Difficulty with learning basic skills compared to peers",
                    "Struggles in communication, social interaction, or play",
                    "Poor coordination or fine motor skills (using hands, holding pencil)",
                    "Behavioural concerns – frustration, restlessness, short attention span"
                ]
            },
            {
                "title": "Basic Strategies to Manage Developmental Delays",
                "points": [
                    "Early intervention – consult a pediatrician or child psychologist",
                    "Engage in play-based learning and therapy (speech, occupational, special education)",
                    "Break skills into small, manageable steps",
                    "Use praise and positive reinforcement for progress",
                    "Encourage daily routines with structure and predictability",
                    "Involve parents consistently in home practice"
                ]
            },
            {
                "title": "Recovery Facts & Hope",
                "points": [
                    "With early therapy, 60–70% of children show significant improvement",
                    "Many children catch up with peers when given the right support early",
                    "Family involvement accelerates growth and skill development",
                    "Each small milestone leads to bigger success over time"
                ]
            }
        ]
    },

    "Fears": {
        "intro": "Fear is a feeling, not a life sentence. With guidance, you can retrain your mind to feel safe and strong. Many before you have conquered their fears—you can too.",
        "sections": [
            {
                "title": "Symptoms",
                "points": [
                    "Intense worry or fear about specific situations (darkness, animals, exams, crowds, etc.)",
                    "Physical reactions – sweating, fast heartbeat, shaky hands",
                    "Avoiding places or situations due to fear",
                    "Overthinking worst-case scenarios",
                    "Difficulty focusing when faced with the feared object or thought"
                ]
            },
            {
                "title": "Basic Strategies to Manage Fears",
                "points": [
                    "Gradual exposure – face fears step by step, in a safe way",
                    "Relaxation skills – deep breathing, mindfulness, grounding exercises",
                    "Talking about fears with a trusted person or therapist",
                    "Replace negative thoughts with positive, realistic ones",
                    "Build confidence through small achievements",
                    "Limit scary content (movies, social media triggers)"
                ]
            },
            {
                "title": "Recovery Facts & Hope",
                "points": [
                    "80–90% improve with counselling/CBT techniques",
                    "Fears often reduce within weeks of consistent therapy",
                    "Millions of people worldwide overcome phobias and lead normal lives",
                    "Early help prevents fears from controlling daily life"
                ]
            },

        ]
    },

    "Impairment": {
        "intro": "An impairment does not limit your potential. With the right tools, therapy, and support, you can lead a life full of dignity, independence, and achievement.",
        "sections": [
            {
                "title": "What is an Impairment?",
                "points": [
                    "An impairment means a loss or limitation of a body function, structure, or mental ability that makes daily tasks harder.",
                    "It may be physical, sensory, cognitive, or psychosocial in nature."
                ]
            },
            {
                "title": "Symptoms",
                "points": [
                    "Child or adult learns and develops more slowly than peers",
                    "Difficulty in problem-solving, reasoning, or abstract thinking",
                    "Trouble with reading, writing, or daily self-care skills",
                    "May need extra time and support for communication or academics",
                    "Behavioural challenges like frustration, dependency, or withdrawal"
                ]
            },
            {
                "title": "Types of Impairments",
                "points": [
                    "Physical Impairments – Difficulty in movement, mobility, or coordination (e.g., cerebral palsy, polio, spinal cord injury)",
                    "Sensory Impairments – Affect vision, hearing, or both (e.g., blindness, low vision, deafness, hearing loss)",
                    "Intellectual Impairments – Below-average intellectual functioning and adaptive challenges (e.g., Intellectual Disability, Down Syndrome)",
                    "Psychosocial / Mental Impairments – Emotional, behavioural, or social interaction difficulties (e.g., depression, schizophrenia, bipolar disorder)",
                    "Neurological Impairments – Brain or nerve-related conditions affecting body/mind (e.g., epilepsy, multiple sclerosis, dementia, autism spectrum disorder)",
                    "Learning Impairments – Specific reading, writing, or math difficulties despite normal intelligence (e.g., Dyslexia, Dysgraphia, Dyscalculia)"
                ]
            },
            {
                "title": "Basic Strategies to Manage Impairments",
                "points": [
                    "Early diagnosis and therapy tailored to the type of impairment",
                    "Use assistive devices (wheelchair, hearing aids, screen readers) when needed",
                    "Provide special education and individualized learning support",
                    "Offer counselling for emotional strength and self-acceptance",
                    "Train families to provide patience, support, and structured routines",
                    "Encourage independence and skill training for daily living"
                ]
            },
            {
                "title": "Recovery Facts & Hope",
                "points": [
                    "Many impairments can be managed effectively with therapy and support systems",
                    "Assistive technology and rehabilitation improve independence",
                    "Early support increases confidence, education, and job opportunities",
                    "Millions worldwide live happy and successful lives with impairments"
                ]
            },

        ]
    },

    "OCD": {
        "intro": "OCD is not about being “weak” or “strange.” It is a common, treatable condition. With therapy, countless people have learned to break free from rituals and regain peace of mind. You can too.",
        "sections": [
            {
                "title": "Symptoms",
                "points": [
                    "Repeated, unwanted thoughts (obsessions) that cause anxiety",
                    "Repetitive behaviours (compulsions) like checking, washing, counting, or arranging",
                    "Feeling driven to perform rituals to relieve anxiety",
                    "Time-consuming routines affecting school, work, or relationships",
                    "Awareness that behaviours are excessive but feeling unable to stop"
                ]
            },
            {
                "title": "Types of OCD",
                "points": [
                    "Checking OCD – repeatedly checking doors, locks, appliances",
                    "Contamination OCD – excessive cleaning or avoiding dirt/germs",
                    "Symmetry & Ordering OCD – arranging items until they feel 'just right'",
                    "Intrusive Thoughts OCD – distressing unwanted thoughts (violent, sexual, or blasphemous)",
                    "Hoarding OCD – difficulty discarding items, fear of losing something important"
                ]
            },
            {
                "title": "Basic Strategies to Manage OCD",
                "points": [
                    "Cognitive Behavioural Therapy (CBT) with Exposure & Response Prevention (ERP)",
                    "Relaxation techniques and mindfulness to reduce anxiety",
                    "Limit avoidance behaviours gradually and safely",
                    "Family education to reduce criticism and increase support",
                    "In severe cases, medication prescribed by psychiatrists may help"
                ]
            },
            {
                "title": "Recovery Facts & Hope",
                "points": [
                    "60–70% of people improve significantly with CBT/ERP therapy",
                    "Symptoms can reduce within 3–6 months of consistent counselling",
                    "Many patients regain normal functioning and control over life",
                    "Relapse prevention strategies ensure long-term stability"
                ]
            },

        ]
    },
    "Intellectual Issues": {
        "intro": "Intellectual issues do not take away a person’s ability to learn, grow, and live a meaningful life. Every small progress counts. With patience, love, and professional support, children and adults can achieve far more than expected.",
        "sections": [
            {
                "title": "Symptoms",
                "points": [
                    "Delayed developmental milestones (walking, talking, learning)",
                    "Difficulty in reasoning, problem-solving, and abstract thinking",
                    "Trouble in academics – reading, writing, numbers",
                    "Challenges with daily self-care (dressing, hygiene, money handling)",
                    "Behavioural concerns – frustration, dependency, low confidence",
                    "Needs extra time and support compared to peers"
                ]
            },
            {
                "title": "Basic Strategies to Manage Intellectual Issues",
                "points": [
                    "Early identification and Individualized Education Plans (IEPs)",
                    "Special education support with simplified teaching methods",
                    "Use of visual aids, repetition, and structured routines",
                    "Behaviour therapy to handle frustration and improve social skills",
                    "Life skills and vocational training for independence",
                    "Regular counselling for family to build acceptance and coping",
                    "Encourage participation in play, social activities, and community support"
                ]
            },
            {
                "title": "Recovery Facts & Hope",
                "points": [
                    "Intellectual disability is lifelong, but skills and independence improve greatly with therapy",
                    "Early intervention (before age 6) shows best outcomes",
                    "Many individuals achieve independent or semi-independent living",
                    "With supportive environments, people can study, work, and form relationships successfully"
                ]
            },

        ]
    },

    "Parenting": {
        "intro": "Parenting does not come with a manual—but you don’t have to do it alone. With guidance, patience, and support, families can overcome challenges and grow stronger together. Every small change in parenting makes a big difference in a child’s life.",
        "sections": [
            {
                "title": "Common Challenges Parents Face",
                "points": [
                    "Balancing work, home, and child’s needs",
                    "Managing behavioural issues like tantrums, defiance, or withdrawal",
                    "Helping children cope with learning difficulties or special needs",
                    "Communication gaps between parent and child (especially teens)",
                    "Feeling guilty, stressed, or overwhelmed by parenting responsibilities",
                    "Conflicts in parenting style between mother, father, or grandparents"
                ]
            },
            {
                "title": "Types of Parenting Styles",
                "points": [
                    "Authoritative (Balanced) – Warm, supportive, but firm with rules. Encourages independence and sets clear boundaries. Most effective style; kids are confident, responsible, and happy.",
                    "Authoritarian (Strict) – High rules, low warmth. Children may be obedient but often anxious or withdrawn.",
                    "Permissive (Easy-going) – Very loving, but few or no rules or limits. Kids may struggle with self-control and responsibility.",
                    "Neglectful (Uninvolved) – Low warmth and low rules. Children often feel ignored, develop low self-esteem, and face trust issues."
                ]
            },
            {
                "title": "Basic Parenting Strategies",
                "points": [
                    "Consistent routines help children feel safe and stable",
                    "Use positive reinforcement (praise, rewards) more than punishment",
                    "Listen actively – allow children to share feelings without judgment",
                    "Break tasks into small, achievable steps to reduce pressure",
                    "Encourage independence while providing guidance",
                    "Take care of your own mental health – calm parents raise calmer kids",
                    "Seek professional counselling if conflicts or stress feel unmanageable"
                ]
            },
            {
                "title": "Recovery Facts & Hope",
                "points": [
                    "Research shows that parenting interventions reduce stress and improve child behaviour in 70–80% of families",
                    "Children show better emotional regulation and learning outcomes when parents practice positive parenting",
                    "Parenting counselling helps parents regain confidence, reduce guilt, and rebuild healthy family bonds"
                ]
            },

        ]
    },

    "Personality Disorder": {
        "intro": "Personality disorders are challenging, but not a life sentence. With long-term therapy, many people show significant improvement and regain control over their lives.",
        "sections": [
            {
                "title": "Symptoms",
                "points": [
                    "Long-term patterns of thinking, feeling, and behaving that cause distress or problems in daily life",
                    "Rigid and extreme ways of relating to others",
                    "Difficulty in managing emotions or controlling impulses",
                    "Struggles with relationships (unstable, intense, or distant)",
                    "Low self-esteem, identity confusion, or fear of abandonment"
                ]
            },
            {
                "title": "Types of Personality Disorders",
                "points": [
                    "Cluster A (Odd/Eccentric): Paranoid, Schizoid, Schizotypal",
                    "Cluster B (Dramatic/Emotional): Borderline, Narcissistic, Antisocial, Histrionic",
                    "Cluster C (Anxious/Fearful): Avoidant, Dependent, Obsessive-Compulsive (OCPD)"
                ]
            },
            {
                "title": "Basic Strategies to Manage Personality Disorders",
                "points": [
                    "Psychotherapy (main treatment): Dialectical Behaviour Therapy (DBT), Cognitive Behaviour Therapy (CBT), and Schema Therapy",
                    "Medication may help with mood swings, anxiety, or depression",
                    "Build stable daily routines and learn coping skills",
                    "Family counselling to improve support and reduce conflicts",
                    "Encourage healthy lifestyle – sleep, exercise, and avoiding alcohol or substance abuse"
                ]
            },
            {
                "title": "Recovery Facts & Hope",
                "points": [
                    "With long-term therapy, 60–70% of patients show significant improvement",
                    "Many people with Borderline Personality Disorder see major recovery within 2–6 years of consistent therapy",
                    "Supportive family and professional help greatly improve outcomes"
                ]
            },

        ]
    },
    "PTSD": {
        "intro": "PTSD is your mind’s way of saying it has been through too much—but it can heal. The past does not have to control your future. With the right help, you can regain peace, safety, and joy in life. Reaching out is the first step toward recovery.",
        "sections": [
            {
                "title": "Symptoms",
                "points": [
                    "Reliving the trauma (flashbacks, nightmares, intrusive thoughts)",
                    "Avoiding reminders of the event (places, people, conversations)",
                    "Feeling constantly alert, tense, or easily startled",
                    "Negative thoughts about self, others, or the world",
                    "Emotional numbness or withdrawal from loved ones",
                    "Trouble sleeping or concentrating",
                    "Mood swings, irritability, guilt, or shame"
                ]
            },
            {
                "title": "What You May Notice in Your Loved One",
                "points": [
                    "Nightmares or flashbacks about the event",
                    "Avoiding people, places, or activities that remind them of trauma",
                    "Becoming easily startled, tense, or ‘on edge’",
                    "Trouble sleeping or focusing",
                    "Sudden anger, irritability, or sadness",
                    "Pulling away or not wanting to talk",
                    "Feeling guilty, hopeless, or ‘broken’"
                ]
            },
            {
                "title": "Basic Strategies to Manage PTSD",
                "points": [
                    "Grounding techniques (deep breathing, focusing on the present moment)",
                    "Keep a daily routine to feel safe and in control",
                    "Talk about your feelings with a trusted person (do not isolate)",
                    "Practice relaxation – yoga, meditation, or light exercise",
                    "Avoid alcohol, drugs, or overuse of screens as coping tools",
                    "Seek professional therapy (CBT, EMDR, trauma-focused therapy)"
                ]
            },
            {
                "title": "Recovery Facts & Hope",
                "points": [
                    "With proper treatment, like CBT and EMDR, 60–80% of people see major improvement in symptoms",
                    "Many people feel relief within 8–16 sessions of trauma-focused counselling",
                    "PTSD is common after accidents, abuse, disasters, or violence – you are not alone",
                    "Healing is possible at any stage of life – therapy helps the brain process trauma safely",
                    "Progress may be slow, but every step forward counts",
                    "Love, patience, and support from family make a huge difference"
                ]
            },

        ]
    },

    "Self Esteem": {
        "intro": "You are more capable and worthy than you believe. Low self-esteem is just a filter – not the truth about who you are. With the right tools and support, you can learn to value yourself, live with confidence, and achieve the life you deserve.",
        "sections": [
            {
                "title": "Symptoms of Low Self-Esteem",
                "points": [
                    "Constant self-criticism or negative self-talk",
                    "Feeling “not good enough” compared to others",
                    "Difficulty accepting compliments",
                    "Avoiding challenges due to fear of failure",
                    "Over-dependence on others’ opinions for self-worth",
                    "Struggles with decision-making or setting boundaries",
                    "Feeling undeserving of success or happiness"
                ]
            },
            {
                "title": "Basic Strategies to Build Self-Esteem",
                "points": [
                    "Practice positive self-talk – replace “I can’t” with “I’ll try”",
                    "Set small, achievable goals and celebrate progress",
                    "Write down 3 things you like about yourself daily",
                    "Spend time with supportive and positive people",
                    "Learn a new skill or hobby – success builds confidence",
                    "Take care of your body (sleep, exercise, healthy food)",
                    "Seek therapy or counselling to challenge negative beliefs"
                ]
            },
            {
                "title": "Recovery Facts & Hope",
                "points": [
                    "Research shows 70–80% of people improve self-esteem with therapy and self-practice",
                    "CBT, affirmations, and group support work effectively within 8–12 weeks",
                    "Low self-esteem is common, but not permanent – many people rebuild confidence at any age",
                    "Building self-esteem improves mental health, relationships, and career success"
                ]
            },
        ]
    },

    "SLD": {
        "intro": "Having a learning disability does not mean failure. It simply means learning differently. With the right strategies, patience, and encouragement, every child and adult with SLD can shine in their own unique way.",
        "sections": [
            {
                "title": "Common Signs & Symptoms",
                "points": [
                    "Difficulty in reading (Dyslexia) – mixing up letters, slow reading, poor comprehension",
                    "Difficulty in writing (Dysgraphia) – poor handwriting, spelling mistakes, trouble organizing thoughts",
                    "Difficulty in math (Dyscalculia) – struggles with numbers, counting, or solving problems",
                    "Slow learning compared to peers, despite normal intelligence",
                    "Trouble remembering instructions or sequences",
                    "Low confidence, frustration, or school avoidance due to repeated struggles"
                ]
            },
            {
                "title": "Basic Strategies to Support SLD",
                "points": [
                    "Use multi-sensory learning methods (visuals, audio, hands-on practice)",
                    "Break learning into small, simple steps",
                    "Provide extra time during tests and assignments",
                    "Encourage strengths and talents (art, music, sports, creativity)",
                    "Use assistive tools like reading software, calculators, or audio books",
                    "Work with special educators, counsellors, and teachers as a team",
                    "Focus on building confidence and emotional support along with academics"
                ]
            },
            {
                "title": "Recovery Facts & Hope",
                "points": [
                    "SLD is not a problem of intelligence – children and adults with SLD can succeed with the right support",
                    "Early intervention and special education improve learning outcomes by 60–80%",
                    "Many successful people (scientists, artists, entrepreneurs) had learning difficulties but achieved great success",
                    "With therapy and accommodations, individuals can lead happy, independent, and successful lives"
                ]
            },

        ]
    },

    "Social Anxiety": {
        "intro": "Social anxiety does not define who you are. Step by step, you can learn to feel calm and confident around people. Every small effort builds strength – and the courage you need is already within you.",
        "sections": [
            {
                "title": "Symptoms",
                "points": [
                    "Intense fear of being judged or embarrassed in social situations",
                    "Avoiding speaking, eating, or performing in front of others",
                    "Physical signs: sweating, blushing, shaky voice, racing heartbeat",
                    "Overthinking conversations (“Did I say something wrong?”)",
                    "Difficulty making friends or participating in group activities",
                    "Feeling isolated, lonely, or “different” from others"
                ]
            },
            {
                "title": "Basic Strategies to Manage Social Anxiety",
                "points": [
                    "Practice slow breathing before and during social situations",
                    "Start with small, safe interactions and gradually face bigger challenges",
                    "Prepare simple conversation starters in advance",
                    "Challenge negative thoughts (“People will laugh at me”) with positive ones (“I can handle this”)",
                    "Limit caffeine and stimulants which can increase anxiety",
                    "Practice role-play or social skills training with a counsellor or trusted friend",
                    "Seek therapy – CBT and exposure therapy are highly effective"
                ]
            },
            {
                "title": "Recovery Facts & Hope",
                "points": [
                    "With proper therapy, 60–80% of people improve significantly",
                    "Many report progress in 8–12 sessions of counselling",
                    "Social anxiety is very common and highly treatable",
                    "Countless people who once avoided social life now live confidently and happily"
                ]
            },

        ]
    },
    "Depression": {
        "intro": "Depression can feel like a heavy cloud, but it will pass. With the right help, life can feel lighter, brighter, and worth living again.",
        "sections": [
            {
                "title": "Symptoms",
                "points": [
                    "Feeling sad, empty, or hopeless most of the day",
                    "Loss of interest in hobbies or things you once enjoyed",
                    "Tiredness or low energy even after rest",
                    "Changes in sleep (too little or too much)",
                    "Changes in appetite or weight",
                    "Trouble concentrating or making decisions",
                    "Thoughts of worthlessness or guilt"
                ]
            },
            {
                "title": "Basic Strategies to Manage Depression",
                "points": [
                    "Keep a daily routine, even if small",
                    "Take short walks or do light physical activity",
                    "Eat balanced, regular meals",
                    "Connect with friends or family daily",
                    "Set small, achievable goals",
                    "Practice gratitude – note 1–2 good things each day",
                    "Avoid isolating yourself, even if it feels hard"
                ]
            },
            {
                "title": "Recovery Facts & Hope",
                "points": [
                    "With therapy and/or medication, 80% of people show major improvement",
                    "Many notice positive changes in 6–8 weeks of treatment",
                    "Depression is treatable, and recovery is possible at any stage",
                    "You are not weak – depression is a medical condition, not a personal failure"
                ]
            },

        ]
    },

    "Learning Delays": {
        "intro": "A learning delay is not a life sentence. With patience, the right strategies, and consistent support, children can thrive in school and life.",
        "sections": [
            {
                "title": "Common Signs",
                "points": [
                    "Struggles to read, write, or do math at expected level",
                    "Difficulty understanding instructions",
                    "Trouble remembering what was learned yesterday",
                    "Slow to process or respond to questions",
                    "Avoids schoolwork or gets easily frustrated",
                    "Needs extra time to finish tasks"
                ]
            },
            {
                "title": "Basic Strategies to Support Learning",
                "points": [
                    "Break lessons into small, manageable steps",
                    "Use visuals, charts, and hands-on activities",
                    "Give extra time for tasks and tests",
                    "Praise effort, not just results",
                    "Practice skills daily in short, focused sessions",
                    "Work closely with teachers and specialists",
                    "Encourage hobbies and strengths outside academics"
                ]
            },
            {
                "title": "Recovery Facts & Hope",
                "points": [
                    "With early support, most children make steady progress",
                    "Special education plans and therapy can improve skills in a few months",
                    "Every child learns at their own pace – growth is possible at any age",
                    "Many successful adults once had learning delays"
                ]
            },

        ]
    },

    "Emotional Abuse / Trauma": {
        "intro": "What happened to you does not define you. Healing is possible, and every step you take toward self-care is an act of strength.",
        "sections": [
            {
                "title": "Common Symptoms",
                "points": [
                    "Feeling constantly blamed, criticized, or humiliated",
                    "Low self-esteem or self-doubt",
                    "Fear of speaking up or making mistakes",
                    "Feeling “on edge” or walking on eggshells",
                    "Trouble trusting others",
                    "Flashbacks, nightmares, or strong emotional reactions",
                    "Difficulty regulating emotions (anger, sadness, anxiety)"
                ]
            },
            {
                "title": "Basic Strategies to Begin Healing",
                "points": [
                    "Remind yourself: abuse is never your fault",
                    "Reach out to a trusted friend, counsellor, or support group",
                    "Practice grounding techniques (deep breathing, naming 5 things you see)",
                    "Keep a journal to express thoughts and feelings",
                    "Learn healthy boundaries and practice saying “no”",
                    "Engage in calming activities (music, art, gentle movement)",
                    "Seek professional therapy for deeper healing"
                ]
            },
            {
                "title": "Recovery Facts & Hope",
                "points": [
                    "Many survivors show significant emotional recovery in 6–12 months with therapy",
                    "Trauma-focused counselling (like CBT or EMDR) has high success rates",
                    "Emotional wounds can heal, and trust can be rebuilt over time",
                    "Survivors often emerge stronger, more self-aware, and resilient"
                ]
            },

        ]
    },

    "Behavioural Challenges": {
        "intro": "Behaviour can change. With patience, structure, and the right support, challenges can turn into strengths.",
        "sections": [
            {
                "title": "Common Symptoms",
                "points": [
                    "Frequent temper outbursts or defiance",
                    "Difficulty following rules or instructions",
                    "Aggression (verbal or physical) toward others",
                    "Restlessness or inability to sit still",
                    "Impulsive actions without thinking of consequences",
                    "Withdrawal or refusal to participate in activities",
                    "Struggling to manage emotions in daily situations"
                ]
            },
            {
                "title": "Basic Strategies to Address Behavioural Challenges",
                "points": [
                    "Stay calm and consistent in responses",
                    "Set clear rules and explain consequences in simple language",
                    "Praise positive behaviour immediately",
                    "Use structured routines to reduce uncertainty",
                    "Offer choices to encourage responsibility",
                    "Model the behaviour you want to see",
                    "Work with teachers or therapists for consistent strategies"
                ]
            },
            {
                "title": "Recovery Facts & Hope",
                "points": [
                    "With consistent guidance and support, most children show improvement within months",
                    "Behavioural therapy and skill training can bring lasting change",
                    "Early intervention greatly improves success rates",
                    "Many children with early behavioural issues grow into well-adjusted, successful adults"
                ]
            },

        ]
    },

    "Relationship / Conflicts": {
        "intro": "Disagreements don’t have to end relationships. With respect, patience, and open communication, love and connection can grow stronger than before.",
        "sections": [
            {
                "title": "Common Symptoms",
                "points": [
                    "Frequent arguments or misunderstandings",
                    "Feeling unheard, unappreciated, or disconnected",
                    "Trust issues or jealousy",
                    "Avoiding conversations about important topics",
                    "Resentment building over time",
                    "Difficulty balancing individual needs with the relationship",
                    "Emotional or physical distance"
                ]
            },
            {
                "title": "Basic Strategies to Improve Relationships",
                "points": [
                    "Practice active listening without interrupting",
                    "Express feelings using “I” statements instead of blame",
                    "Set aside time for shared activities",
                    "Respect personal boundaries and differences",
                    "Focus on solving the problem, not attacking the person",
                    "Learn healthy conflict resolution skills",
                    "Seek couples or family counselling when needed"
                ]
            },
            {
                "title": "Recovery Facts & Hope",
                "points": [
                    "Communication-focused counselling helps 70–80% of couples improve their relationship",
                    "Many conflicts can be resolved or reduced within 8–12 sessions",
                    "Healthy relationships can be rebuilt even after years of struggle",
                    "Working together strengthens trust, closeness, and understanding"
                ]
            },

        ]
    },

    "Autism / ASD": {
        "intro": "Autism is not about limitations—it’s about different ways of thinking, learning, and experiencing the world. With understanding and the right support, children with ASD can shine in their own unique way.",
        "sections": [
            {
                "title": "Common Symptoms (may vary from person to person)",
                "points": [
                    "Difficulty with social interactions (eye contact, making friends)",
                    "Prefers routines and may get upset with changes",
                    "Repetitive behaviours (hand-flapping, rocking, repeating words)",
                    "Strong interests in specific topics or activities",
                    "Sensitivity to sounds, lights, textures, or smells",
                    "May have delayed speech or unusual speech patterns",
                    "Finds it hard to understand social cues or emotions of others"
                ]
            },
            {
                "title": "Basic Strategies to Support a Child with ASD",
                "points": [
                    "Use clear, simple instructions",
                    "Create predictable daily routines",
                    "Break tasks into small, manageable steps",
                    "Use visual aids (pictures, charts, schedules)",
                    "Encourage strengths and special interests",
                    "Practice social skills in small, supportive settings",
                    "Work closely with therapists and teachers"
                ]
            },
            {
                "title": "Recovery Facts & Hope",
                "points": [
                    "Early intervention leads to significant improvements in communication and behaviour",
                    "Many children develop independence and meaningful relationships over time",
                    "Social, language, and life skills can improve with therapy and consistent support",
                    "People with ASD can live fulfilling, successful lives when their needs are understood and supported"
                ]
            },
        ]
    },

    "ADHD": {
        "intro": "ADHD doesn’t mean you can’t achieve great things—it just means your brain works differently. With the right tools and support, you can thrive.",
        "sections": [
            {
                "title": "Common Symptoms (may vary by age)",
                "points": [
                    "Difficulty paying attention or staying focused",
                    "Easily distracted by sights, sounds, or thoughts",
                    "Forgetting instructions or losing things often",
                    "Restlessness or trouble sitting still",
                    "Talking excessively or interrupting others",
                    "Impulsive decisions without thinking of consequences",
                    "Trouble finishing tasks or following through"
                ]
            },
            {
                "title": "Basic Strategies to Manage ADHD",
                "points": [
                    "Use a structured daily routine",
                    "Break big tasks into smaller, timed steps",
                    "Use reminders, planners, or visual schedules",
                    "Give clear, simple instructions",
                    "Allow short movement breaks between activities",
                    "Minimize distractions in the work or study area",
                    "Focus on strengths and praise effort"
                ]
            },
            {
                "title": "Recovery Facts & Hope",
                "points": [
                    "With the right support, children and adults with ADHD can succeed in school, work, and relationships",
                    "Behaviour therapy, coaching, and sometimes medication greatly improve focus and self-control",
                    "Many people with ADHD develop excellent problem-solving, creativity, and leadership skills",
                    "Early understanding and support reduce frustration and boost confidence"
                ]
            },
        ]
    }
}

const FreeTherapy = () => {
    const [selected, setSelected] = useState(null);

    const details = therapyDetails[selected];

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#6b2400] via-[#f76822] to-[#f76822] text-white">
            <Navbar />

            <div className="flex-grow flex flex-col items-center py-16 px-4 text-center">
                <h1 className="text-3xl md:text-5xl mt-14 font-bold mb-10">
                    Free Therapy Tips
                </h1>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl">
                    {therapyOptions.map((item, index) => (
                        <motion.button
                            key={index}
                            onClick={() => setSelected(item)}
                            whileHover={{ scale: 1.05 }}
                            className="bg-white/20 hover:bg-white/30 backdrop-blur-md p-4 rounded-xl shadow-lg text-lg font-semibold transition"
                        >
                            {item}
                        </motion.button>
                    ))}
                </div>
            </div>

            <Footer />
            <AnimatePresence>
                {selected && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="bg-white text-black rounded-2xl max-w-2xl w-full p-6 overflow-y-auto max-h-[80vh] relative"
                        >
                            <button
                                onClick={() => setSelected(null)}
                                className="absolute top-3 right-3 text-gray-600 hover:text-black"
                            >
                                <X size={24} />
                            </button>
                            <h2 className="text-3xl font-bold mb-3 text-orange-600">{selected}</h2>
                            {details ? (
                                <div className="text-left">
                                    <p className="whitespace-pre-line leading-relaxed text-gray-800 mb-4">
                                        {details.intro}
                                    </p>
                                    {details.sections.map((section, i) => (
                                        <div key={i} className="mb-4">
                                            <h3 className="text-lg font-bold text-gray-900 mb-2">{section.title}</h3>
                                            <ul className="list-disc list-inside space-y-1 text-gray-800">
                                                {section.points.map((point, j) => (
                                                    <li key={j}>{point}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>Details coming soon...</p>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FreeTherapy;





