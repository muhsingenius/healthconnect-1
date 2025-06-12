-- Insert sample questions
INSERT INTO questions (
  title,
  content,
  author_id,
  author_name,
  is_anonymous,
  is_public,
  category,
  tags,
  upvotes,
  views,
  image_urls,
  created_at,
  updated_at
) VALUES
-- Question 1: Diabetes symptoms
(
  'What are the early symptoms of diabetes?',
  'I''ve been experiencing increased thirst and frequent urination for the past few weeks. I''m 35 years old and have a family history of diabetes. Should I be concerned about diabetes? What other symptoms should I look out for? I''m also feeling more tired than usual and sometimes get blurry vision.',
  NULL,
  'Anonymous',
  true,
  true,
  'Diabetes',
  ARRAY['diabetes', 'symptoms', 'health', 'family-history'],
  24,
  156,
  ARRAY[]::text[],
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '2 days'
),

-- Question 2: General health checkup
(
  'How often should I get a general health checkup?',
  'I''m 35 years old and generally healthy. I exercise regularly and eat well, but I''m not sure how frequently I should visit a doctor for routine checkups. What tests should be included in a general health screening at my age?',
  NULL,
  'John D.',
  false,
  true,
  'Preventive Care',
  ARRAY['checkup', 'preventive', 'health', 'screening'],
  12,
  89,
  ARRAY[]::text[],
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '1 day'
),

-- Question 3: High blood pressure diet
(
  'Best foods for managing high blood pressure?',
  'Recently diagnosed with hypertension (blood pressure 150/95). My doctor mentioned dietary changes could help manage it naturally. What specific foods should I include or avoid? Are there any meal plans you''d recommend? I''m also wondering about salt intake and exercise.',
  NULL,
  'Sarah M.',
  false,
  true,
  'Nutrition',
  ARRAY['hypertension', 'diet', 'nutrition', 'blood-pressure'],
  31,
  203,
  ARRAY[]::text[],
  NOW() - INTERVAL '3 days',
  NOW() - INTERVAL '3 days'
),

-- Question 4: Mental health and anxiety
(
  'How to manage anxiety and stress naturally?',
  'I''ve been dealing with increased anxiety lately, especially at work. I experience rapid heartbeat, sweating, and difficulty concentrating. Are there natural ways to manage these symptoms? Should I consider seeing a mental health professional?',
  NULL,
  'Anonymous',
  true,
  true,
  'Mental Health',
  ARRAY['anxiety', 'stress', 'mental-health', 'natural-remedies'],
  18,
  134,
  ARRAY[]::text[],
  NOW() - INTERVAL '4 hours',
  NOW() - INTERVAL '4 hours'
),

-- Question 5: Pregnancy nutrition
(
  'Essential nutrients during pregnancy?',
  'I''m 12 weeks pregnant with my first child. What are the most important nutrients I should focus on? I''m already taking prenatal vitamins, but I want to make sure my diet is optimal for my baby''s development. Any foods I should avoid?',
  NULL,
  'Maria L.',
  false,
  true,
  'Nutrition',
  ARRAY['pregnancy', 'nutrition', 'prenatal', 'diet'],
  27,
  178,
  ARRAY[]::text[],
  NOW() - INTERVAL '6 hours',
  NOW() - INTERVAL '6 hours'
),

-- Question 6: Exercise and joint pain
(
  'Safe exercises for people with joint pain?',
  'I''m 45 years old and have been experiencing knee and hip pain, especially in the mornings. I want to stay active but I''m worried about making the pain worse. What types of exercises are safe and beneficial for joint health?',
  NULL,
  'Robert K.',
  false,
  true,
  'General Medicine',
  ARRAY['joint-pain', 'exercise', 'arthritis', 'fitness'],
  15,
  92,
  ARRAY[]::text[],
  NOW() - INTERVAL '8 hours',
  NOW() - INTERVAL '8 hours'
),

-- Question 7: Sleep disorders
(
  'Trouble sleeping - when should I see a doctor?',
  'I''ve been having trouble falling asleep and staying asleep for the past month. I wake up feeling tired even after 7-8 hours in bed. I''ve tried reducing caffeine and screen time before bed. When should I consider seeing a doctor about this?',
  NULL,
  'Anonymous',
  true,
  true,
  'General Medicine',
  ARRAY['sleep', 'insomnia', 'fatigue', 'sleep-hygiene'],
  9,
  67,
  ARRAY[]::text[],
  NOW() - INTERVAL '12 hours',
  NOW() - INTERVAL '12 hours'
),

-- Question 8: Skin health
(
  'How to maintain healthy skin as I age?',
  'I''m in my 40s and starting to notice more wrinkles and age spots. What are the most effective ways to maintain healthy skin? Should I be using specific skincare products or considering professional treatments?',
  NULL,
  'Lisa T.',
  false,
  true,
  'General Medicine',
  ARRAY['skin-health', 'aging', 'skincare', 'dermatology'],
  22,
  145,
  ARRAY[]::text[],
  NOW() - INTERVAL '1 day 6 hours',
  NOW() - INTERVAL '1 day 6 hours'
);

-- Insert sample answers using a PL/pgSQL block to link to questions
DO $$
DECLARE
    q1_id uuid;
    q2_id uuid;
    q3_id uuid;
    q4_id uuid;
    q5_id uuid;
    q6_id uuid;
    q7_id uuid;
BEGIN
    -- Get the question IDs we just inserted
    SELECT id INTO q1_id FROM questions WHERE title = 'What are the early symptoms of diabetes?' LIMIT 1;
    SELECT id INTO q2_id FROM questions WHERE title = 'How often should I get a general health checkup?' LIMIT 1;
    SELECT id INTO q3_id FROM questions WHERE title = 'Best foods for managing high blood pressure?' LIMIT 1;
    SELECT id INTO q4_id FROM questions WHERE title = 'How to manage anxiety and stress naturally?' LIMIT 1;
    SELECT id INTO q5_id FROM questions WHERE title = 'Essential nutrients during pregnancy?' LIMIT 1;
    SELECT id INTO q6_id FROM questions WHERE title = 'Safe exercises for people with joint pain?' LIMIT 1;
    SELECT id INTO q7_id FROM questions WHERE title = 'Trouble sleeping - when should I see a doctor?' LIMIT 1;

    -- Insert sample answers
    INSERT INTO answers (
      content,
      question_id,
      author_id,
      author_name,
      author_role,
      is_verified,
      upvotes,
      created_at,
      updated_at
    ) VALUES
    -- Answer to diabetes question
    (
      'The symptoms you''re describing - increased thirst (polydipsia), frequent urination (polyuria), fatigue, and blurred vision - are indeed classic early signs of diabetes. Given your family history, I strongly recommend getting tested as soon as possible. A simple fasting blood glucose test or HbA1c test can provide a diagnosis. Other symptoms to watch for include unexplained weight loss, slow-healing cuts, and frequent infections. Early detection and management are crucial for preventing complications. Please schedule an appointment with your healthcare provider this week.',
      q1_id,
      NULL,
      'Dr. Sarah Johnson',
      'doctor',
      true,
      18,
      NOW() - INTERVAL '1 day 20 hours',
      NOW() - INTERVAL '1 day 20 hours'
    ),

    -- Answer to health checkup question
    (
      'For healthy adults in their 30s, I recommend annual checkups. Your screening should include blood pressure, cholesterol panel, blood glucose, complete blood count, and basic metabolic panel. Depending on your risk factors, you might also need cancer screenings like mammograms (for women) or colonoscopies (starting at 45-50). Don''t forget dental checkups every 6 months and eye exams every 1-2 years. Since you''re maintaining a healthy lifestyle, you''re on the right track! Regular checkups help catch problems early when they''re most treatable.',
      q2_id,
      NULL,
      'Dr. Michael Chen',
      'doctor',
      true,
      8,
      NOW() - INTERVAL '20 hours',
      NOW() - INTERVAL '20 hours'
    ),

    -- Answer to hypertension diet question
    (
      'The DASH diet is excellent for managing hypertension. Focus on fruits, vegetables, whole grains, lean proteins, and low-fat dairy. Limit sodium to less than 2,300mg daily (ideally 1,500mg). Foods to emphasize: leafy greens, berries, beets, oats, bananas, and fatty fish. Avoid processed foods, canned soups, and restaurant meals which are high in sodium. Regular exercise (30 minutes most days) combined with dietary changes can significantly lower blood pressure. Monitor your BP regularly and work with your doctor to track progress.',
      q3_id,
      NULL,
      'Dr. Emily Rodriguez',
      'doctor',
      true,
      25,
      NOW() - INTERVAL '2 days 18 hours',
      NOW() - INTERVAL '2 days 18 hours'
    ),

    -- Answer to anxiety question
    (
      'Your symptoms suggest anxiety, which is very treatable. Natural management techniques include deep breathing exercises, regular physical activity, mindfulness meditation, and maintaining a consistent sleep schedule. Limit caffeine and alcohol. However, given the impact on your work and daily life, I recommend consulting a mental health professional. Cognitive Behavioral Therapy (CBT) is highly effective for anxiety. Don''t hesitate to seek help - anxiety is a medical condition that responds well to treatment.',
      q4_id,
      NULL,
      'Dr. James Wilson',
      'doctor',
      true,
      12,
      NOW() - INTERVAL '2 hours',
      NOW() - INTERVAL '2 hours'
    ),

    -- Answer to pregnancy nutrition question
    (
      'Congratulations on your pregnancy! Key nutrients include folic acid (400-800mcg daily), iron (27mg daily), calcium (1,000mg daily), and DHA omega-3 fatty acids. Eat plenty of leafy greens, lean proteins, dairy, and fatty fish (low-mercury varieties like salmon). Avoid raw fish, unpasteurized products, high-mercury fish, and limit caffeine to 200mg daily. Your prenatal vitamin is a good foundation, but whole foods should be your primary source of nutrients. Stay hydrated and eat small, frequent meals to manage nausea.',
      q5_id,
      NULL,
      'Dr. Amanda Foster',
      'doctor',
      true,
      20,
      NOW() - INTERVAL '4 hours',
      NOW() - INTERVAL '4 hours'
    ),

    -- Answer to joint pain exercise question
    (
      'Low-impact exercises are ideal for joint health. Swimming, water aerobics, cycling, and walking are excellent choices. Strength training with light weights helps support joints. Yoga and tai chi improve flexibility and balance. Start slowly and gradually increase intensity. Apply heat before exercise and ice after if there''s swelling. If pain persists or worsens, see a healthcare provider to rule out arthritis or other conditions. Physical therapy can also provide personalized exercise plans for your specific needs.',
      q6_id,
      NULL,
      'Dr. Robert Martinez',
      'doctor',
      true,
      11,
      NOW() - INTERVAL '6 hours',
      NOW() - INTERVAL '6 hours'
    ),

    -- Patient answer to sleep question
    (
      'I had similar issues and found that keeping a sleep diary helped identify patterns. Also, my doctor recommended seeing a sleep specialist after 4-6 weeks of persistent problems. Sometimes underlying conditions like sleep apnea or anxiety can cause these symptoms. Don''t wait too long to seek help - good sleep is crucial for overall health!',
      q7_id,
      NULL,
      'Jennifer S.',
      'patient',
      false,
      5,
      NOW() - INTERVAL '10 hours',
      NOW() - INTERVAL '10 hours'
    );
END $$;