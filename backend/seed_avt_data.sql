-- =============================================================================
-- HCI MILLIONAIRE — SEED DATA
-- AVT810S: African Values and Theories
-- Namibia University of Science and Technology

INSERT INTO "Category" ("CategoryId", "categoryCode", "name") VALUES
  (1, 'UBUNTU_COMM',   'Ubuntu & Communalism'),
  (2, 'PHIL_SAG',      'Philosophical Sagacity'),
  (3, 'AFRICAN_HCI',   'African HCI Paradigm'),
  (4, 'ETHICS_DATA',   'Ethics & Data Sovereignty'),
  (5, 'DIGITAL_WB',    'Digital Well-Being')
ON CONFLICT ("categoryCode") DO NOTHING;

INSERT INTO "PrizeLevel" ("PrizeLevelId", "prizeLevelCode", "prizeValue", "isSafetyNet") VALUES
  (1,  'PL_Q01',   100,       false),
  (2,  'PL_Q02',   200,       false),
  (3,  'PL_Q03',   300,       false),
  (4,  'PL_Q04',   500,       false),
  (5,  'PL_Q05',   1000,      true),
  (6,  'PL_Q06',   2000,      false),
  (7,  'PL_Q07',   4000,      false),
  (8,  'PL_Q08',   8000,      false),
  (9,  'PL_Q09',   16000,     false),
  (10, 'PL_Q10',   32000,     true),
  (11, 'PL_Q11',   64000,     false),
  (12, 'PL_Q12',   125000,    false),
  (13, 'PL_Q13',   250000,    false),
  (14, 'PL_Q14',   500000,    false),
  (15, 'PL_Q15',   1000000,   false)
ON CONFLICT ("prizeLevelCode") DO NOTHING;

INSERT INTO "Question" ("QuestionId","questionCode","question","CategoryId","PrizeLevelId","isActive")
VALUES (1,'Q01_UBUNTU_EASY',
'The Nguni proverb "umuntu ngumuntu ngabantu" is the philosophical foundation of Ubuntu. What does this proverb most directly mean in the context of HCI design?',
1,1,true)
ON CONFLICT ("questionCode") DO NOTHING;

INSERT INTO "Answer" ("AnswerId","answerCode","answer","QuestionId","isCorrect","justification") VALUES
(101,'A101_A','A person achieves success only through personal effort and individual skill.',1,false,
 'This reflects a Western individualist framing. Ubuntu explicitly rejects the isolated self. (Metz, 2007)'),
(102,'A101_B','A person is a person through other persons — human identity is relational.',1,true,
 'Correct. Ubuntu holds that identity, meaning, and knowledge emerge through relationships, not in isolation (Metz, 2007, J. Political Philosophy, 15(3), 321–341).'),
(103,'A101_C','Technology should be designed to maximise individual productivity.',1,false,
 'Productivity maximisation is a Western HCI priority. Ubuntu centres communal belonging over individual output. (Winschiers-Theophilus & Bidwell, 2013)'),
(104,'A101_D','Community elders should approve all software before it is released.',1,false,
 'While elder engagement is culturally important, this is not what the proverb directly means. The proverb describes relational identity, not approval workflows.')
ON CONFLICT ("answerCode") DO NOTHING;

INSERT INTO "CourseNoteHint" ("CourseNoteHintId","courseNoteHintCode","QuestionId","noteText","isActive") VALUES
(1,'CNH01','1',
'Ubuntu is one of the most studied African philosophical frameworks. Metz (2007) describes it as an ontological claim: the self exists only in and through its relationships with others. This has direct implications for HCI — systems designed for communal contexts must support shared agency, not just private user flows.',
true)
ON CONFLICT ("courseNoteHintCode") DO NOTHING;

INSERT INTO "PhoneAPeerHint" ("PhoneAPeerHintId","phoneAPeerHintCode","QuestionId","avatarName","hintText","isActive") VALUES
(1,'PPH01','1','Amara',
'Think about the word "through" in the proverb — it points to relationship, not achievement. The answer is about how identity itself is formed between people.',
true)
ON CONFLICT ("phoneAPeerHintCode") DO NOTHING;

INSERT INTO "Question" ("QuestionId","questionCode","question","CategoryId","PrizeLevelId","isActive")
VALUES (2,'Q02_PHILSAG_EASY',
'An HCI design team is building a community health app for a rural Namibian village. Following Philosophical Sagacity, whose input should be prioritised in the early design stages?',
2,2,true)
ON CONFLICT ("questionCode") DO NOTHING;

INSERT INTO "Answer" ("AnswerId","answerCode","answer","QuestionId","isCorrect","justification") VALUES
(201,'A201_A','International HCI researchers with peer-reviewed publications on African contexts.',2,false,
 'Philosophical Sagacity specifically values indigenous critical thinkers within communities, not external academic experts (Afolayan & Falola, 2017).'),
(202,'A201_B','The youngest community members, as they are the future users.',2,false,
 'Youth voices matter, but Philosophical Sagacity — Henry Odera Oruka''s framework — centres the reasoned wisdom of community sages, not age demographics alone.'),
(203,'A201_C','Community elders and sages who hold critical reasoning and lived cultural knowledge.',2,true,
 'Correct. Oruka''s Philosophical Sagacity identifies community sages as holders of critical philosophical reasoning, not mere tradition. Their knowledge is irreplaceable in co-design (Afolayan & Falola, 2017, Palgrave Handbook of African Philosophy).'),
(204,'A201_D','Government health ministry officials who understand the policy context.',2,false,
 'Policy officials may be stakeholders, but Philosophical Sagacity is specifically about community-internal wisdom holders, not external authorities.')
ON CONFLICT ("answerCode") DO NOTHING;

INSERT INTO "CourseNoteHint" ("CourseNoteHintId","courseNoteHintCode","QuestionId","noteText","isActive") VALUES
(2,'CNH02','2',
'Henry Odera Oruka distinguished between "folk philosophy" (communal worldviews) and "philosophic sagacity" (critical individual reasoning within a cultural tradition). The sages he documented were not simply tradition-keepers — they reasoned critically about that tradition. In HCI, this means engaging with people who can critically evaluate design decisions in cultural terms.',
true)
ON CONFLICT ("courseNoteHintCode") DO NOTHING;

INSERT INTO "PhoneAPeerHint" ("PhoneAPeerHintId","phoneAPeerHintCode","QuestionId","avatarName","hintText","isActive") VALUES
(2,'PPH02','2','Kwame',
'Philosophical Sagacity is named after "sages" — think about what a sage is. The key is that these are people with critical reasoning within their own cultural framework, not just any community member.',
true)
ON CONFLICT ("phoneAPeerHintCode") DO NOTHING;

INSERT INTO "Question" ("QuestionId","questionCode","question","CategoryId","PrizeLevelId","isActive")
VALUES (3,'Q03_AFRICANHCI_EASY',
'Winschiers-Theophilus and Bidwell (2013) argue that African HCI requires more than applying African visual patterns to a Western interface. What do they call this deeper transformation?',
3,3,true)
ON CONFLICT ("questionCode") DO NOTHING;

INSERT INTO "Answer" ("AnswerId","answerCode","answer","QuestionId","isCorrect","justification") VALUES
(301,'A301_A','Cultural theming — applying Afrocentric colour palettes and iconography.',3,false,
 'Theming is explicitly what Winschiers-Theophilus and Bidwell argue is NOT sufficient. Surface styling does not change the underlying design epistemology.'),
(302,'A301_B','Localisation — translating interface text into African languages.',3,false,
 'Localisation is important but remains a surface-level adaptation. The authors call for an epistemic shift, not translation alone.'),
(303,'A301_C','Epistemic reorientation — building African ways of knowing into the design foundations.',3,true,
 'Correct. Winschiers-Theophilus & Bidwell (2013) describe the required change as an epistemic reorientation: African values must be structural design requirements, not decorative additions (Int. J. Human-Computer Interaction, 29(4), 243–255).'),
(304,'A301_D','Accessibility compliance — meeting WCAG standards for low-literacy users.',3,false,
 'Accessibility is an important design concern but is separate from the decolonial epistemological argument the authors make.')
ON CONFLICT ("answerCode") DO NOTHING;

INSERT INTO "CourseNoteHint" ("CourseNoteHintId","courseNoteHintCode","QuestionId","noteText","isActive") VALUES
(3,'CNH03','3',
'Winschiers-Theophilus and Bidwell (2013) argue that Afro-centric HCI is not about aesthetics. The paradigm shift they describe involves changing the foundational assumptions of design — from the isolated individual user to the communal, relational person. They call this an epistemic shift: changing what counts as valid knowledge in the design process.',
true)
ON CONFLICT ("courseNoteHintCode") DO NOTHING;

INSERT INTO "PhoneAPeerHint" ("PhoneAPeerHintId","phoneAPeerHintCode","QuestionId","avatarName","hintText","isActive") VALUES
(3,'PPH03','3','Nadia',
'The authors use the word "paradigm shift." Think about what the word "epistemic" means — it relates to knowledge. The answer is not about how things look, but about how knowledge is structured in the design process.',
true)
ON CONFLICT ("phoneAPeerHintCode") DO NOTHING;

INSERT INTO "Question" ("QuestionId","questionCode","question","CategoryId","PrizeLevelId","isActive")
VALUES (4,'Q04_ETHICS_EASY',
'Pasipamire and Muroyiwa (2024) warn that AI systems deployed in African contexts frequently reproduce a specific problem. What is that problem?',
4,4,true)
ON CONFLICT ("questionCode") DO NOTHING;

INSERT INTO "Answer" ("AnswerId","answerCode","answer","QuestionId","isCorrect","justification") VALUES
(401,'A401_A','They consume too much electricity, making them unsustainable in low-resource settings.',4,false,
 'Energy consumption is a real concern but is not the specific argument Pasipamire and Muroyiwa (2024) make about AI in African contexts.'),
(402,'A401_B','They are too expensive for African institutions to license or maintain.',4,false,
 'Cost is a barrier, but the authors'' primary argument concerns the content and values embedded in AI training data, not licensing fees.'),
(403,'A401_C','They reproduce biases from Western-dominant training data, producing unfair outcomes.',4,true,
 'Correct. Pasipamire & Muroyiwa (2024) argue that AI systems trained predominantly on Western data encode Western assumptions and produce biased, unfair outcomes when deployed in African contexts (Frontiers in Research Metrics and Analytics, 9, 1486600).'),
(404,'A401_D','They require internet connectivity that is unavailable in rural African communities.',4,false,
 'Connectivity is a digital equity issue but is distinct from the algorithmic bias argument the authors are making.')
ON CONFLICT ("answerCode") DO NOTHING;

INSERT INTO "CourseNoteHint" ("CourseNoteHintId","courseNoteHintCode","QuestionId","noteText","isActive") VALUES
(4,'CNH04','4',
'Algorithmic bias in AI occurs when training data over-represents certain populations. Most large AI datasets are sourced from English-language Western internet content. When these models are applied in African contexts, their outputs embed Western cultural assumptions about what is "normal" or "correct," which can produce discriminatory or irrelevant results.',
true)
ON CONFLICT ("courseNoteHintCode") DO NOTHING;

INSERT INTO "PhoneAPeerHint" ("PhoneAPeerHintId","phoneAPeerHintCode","QuestionId","avatarName","hintText","isActive") VALUES
(4,'PPH04','4','Amara',
'Think about where AI models learn from — the data they are trained on. If that data comes mostly from one part of the world, what gets embedded in the model''s assumptions about people?',
true)
ON CONFLICT ("phoneAPeerHintCode") DO NOTHING;

INSERT INTO "Question" ("QuestionId","questionCode","question","CategoryId","PrizeLevelId","isActive")
VALUES (5,'Q05_DIGITALWB_EASY',
'Al-Mansoori et al. (2023) define digital well-being as technology use that promotes positivity and personal growth. In an African communal context, Marshall et al. (2014) argue that well-being must also include which dimension?',
5,5,true)
ON CONFLICT ("questionCode") DO NOTHING;

INSERT INTO "Answer" ("AnswerId","answerCode","answer","QuestionId","isCorrect","justification") VALUES
(501,'A501_A','Economic productivity — technology should increase household income.',5,false,
 'Economic outcomes are not the dimension Marshall et al. (2014) add to well-being in a communal African context.'),
(502,'A501_B','Communal belonging — whether the system supports shared growth and social connection.',5,true,
 'Correct. Marshall et al. (2014) argue that in communal cultural contexts, well-being is not only individual but relational: does the system support belonging and shared growth? (DIS 2014, pp. 787–796).'),
(503,'A501_C','Entertainment value — the system should be enjoyable and gamified.',5,false,
 'Enjoyment matters for engagement, but this is not the specific communal dimension Marshall et al. add to the well-being definition.'),
(504,'A501_D','Technical reliability — users need consistent uptime and fast performance.',5,false,
 'Reliability is a usability concern, not the relational well-being dimension the authors describe.')
ON CONFLICT ("answerCode") DO NOTHING;

INSERT INTO "CourseNoteHint" ("CourseNoteHintId","courseNoteHintCode","QuestionId","noteText","isActive") VALUES
(5,'CNH05','5',
'Well-being in HCI is often framed individually: does this technology make the individual user feel better, less anxious, or more productive? Marshall et al. (2014) extend this to community well-being: does the technology support the person''s embeddedness in their social and relational network? This is aligned with Ubuntu''s relational ontology.',
true)
ON CONFLICT ("courseNoteHintCode") DO NOTHING;

INSERT INTO "PhoneAPeerHint" ("PhoneAPeerHintId","phoneAPeerHintCode","QuestionId","avatarName","hintText","isActive") VALUES
(5,'PPH05','5','Kwame',
'The question says "in an African communal context" — that is your biggest clue. The extra dimension the authors add relates to the communal part. It is not about what the individual feels, but about how the individual relates to others.',
true)
ON CONFLICT ("phoneAPeerHintCode") DO NOTHING;

INSERT INTO "Question" ("QuestionId","questionCode","question","CategoryId","PrizeLevelId","isActive")
VALUES (6,'Q06_UBUNTU_MED',
'You are designing a leaderboard for the HCI Millionaire platform. A communalism-informed approach (Idang, 2015) would change the leaderboard in what specific way compared to a standard Western design?',
1,6,true)
ON CONFLICT ("questionCode") DO NOTHING;

INSERT INTO "Answer" ("AnswerId","answerCode","answer","QuestionId","isCorrect","justification") VALUES
(601,'A601_A','Remove the leaderboard entirely, since all competition is anti-African.',6,false,
 'African communalism does not eliminate recognition — it reframes it. Removing competition entirely misreads the philosophy (Idang, 2015).'),
(602,'A601_B','Display group achievements and cohort progress alongside individual scores.',6,true,
 'Correct. African Communalism (Idang, 2015) frames learning as a shared space, not a private achievement ladder. A communalist leaderboard shows what the cohort has achieved together, not only who ranked first (Phronimon, 16(2), 97–111).'),
(603,'A601_C','Rank players by the number of lifelines they used, rewarding those who sought help.',6,false,
 'This is creative but does not directly reflect the communalism principle Idang describes. Communalism is about shared achievement, not a help-seeking metric.'),
(604,'A601_D','Replace scores with a personal journal that only the player can see.',6,false,
 'A private journal is the opposite of communalism — it further individualises and isolates the experience rather than making it shared.')
ON CONFLICT ("answerCode") DO NOTHING;

INSERT INTO "CourseNoteHint" ("CourseNoteHintId","courseNoteHintCode","QuestionId","noteText","isActive") VALUES
(6,'CNH06','6',
'Idang (2015) describes African Communalism as a worldview in which the community, not the individual, is the primary unit of social life. In educational technology, this means that success is collective — the group progresses together, and recognition should reflect shared accomplishment. A communalist leaderboard does not eliminate ranking but adds a group dimension.',
true)
ON CONFLICT ("courseNoteHintCode") DO NOTHING;

INSERT INTO "PhoneAPeerHint" ("PhoneAPeerHintId","phoneAPeerHintCode","QuestionId","avatarName","hintText","isActive") VALUES
(6,'PPH06','6','Nadia',
'Communalism is about the shared space. The correct answer does not remove the leaderboard — it changes what the leaderboard shows. Think: what would a communal, not individual, leaderboard display?',
true)
ON CONFLICT ("phoneAPeerHintCode") DO NOTHING;


INSERT INTO "Question" ("QuestionId","questionCode","question","CategoryId","PrizeLevelId","isActive")
VALUES (7,'Q07_PHILSAG_MED',
'The "Sayings of the Sage" lifeline in HCI Millionaire frames a hint as guidance from a community elder rather than a database lookup. Which two philosophical frameworks does this feature deliberately combine?',
2,7,true)
ON CONFLICT ("questionCode") DO NOTHING;

INSERT INTO "Answer" ("AnswerId","answerCode","answer","QuestionId","isCorrect","justification") VALUES
(701,'A701_A','Ethnophilosophy and Ma''at.',7,false,
 'Ethnophilosophy focuses on communal worldviews in oral tradition, and Ma''at relates to balance and justice. Neither directly describes the elder-wisdom-as-hint mechanic.'),
(702,'A701_B','Philosophical Sagacity and course reading materials.',7,true,
 'Correct. The Sage lifeline is grounded in Oruka''s Philosophical Sagacity (elder as critical knowledge authority) and is powered by the actual AVT810S course readings. This combination treats academic citation as elder wisdom (Afolayan & Falola, 2017).'),
(703,'A701_C','Ubuntu and Akan philosophy.',7,false,
 'Ubuntu informs the multiplayer mode and communal features. Akan philosophy is one of the course topics but is not the primary grounding for the Sage lifeline mechanic specifically.'),
(704,'A701_D','Yorùbá philosophy and digital well-being theory.',7,false,
 'Yorùbá philosophy is covered in AVT810S but is not the declared basis for the Sayings of the Sage lifeline as described in the project design document.')
ON CONFLICT ("answerCode") DO NOTHING;

INSERT INTO "CourseNoteHint" ("CourseNoteHintId","courseNoteHintCode","QuestionId","noteText","isActive") VALUES
(7,'CNH07','7',
'Henry Odera Oruka''s Philosophical Sagacity establishes that knowledge passes through dialogue with critical community elders, not through isolated data retrieval. By framing course readings as "what the elder recalls," the Sage lifeline does two things at once: it delivers a content hint and it models the epistemological principle that knowledge is relational.',
true)
ON CONFLICT ("courseNoteHintCode") DO NOTHING;

INSERT INTO "PhoneAPeerHint" ("PhoneAPeerHintId","phoneAPeerHintCode","QuestionId","avatarName","hintText","isActive") VALUES
(7,'PPH07','7','Amara',
'The question says the lifeline does two things: it frames a hint as elder wisdom AND it uses actual course content. One answer names the elder-wisdom philosophy; the other names the content source. Which answer combines both?',
true)
ON CONFLICT ("phoneAPeerHintCode") DO NOTHING;

INSERT INTO "Question" ("QuestionId","questionCode","question","CategoryId","PrizeLevelId","isActive")
VALUES (8,'Q08_AFRICANHCI_MED',
'Kapuire et al. (2018) document community-based co-design projects in Namibia. When engaging San community members, their research shows which approach is ethically required — not merely polite?',
3,8,true)
ON CONFLICT ("questionCode") DO NOTHING;

INSERT INTO "Answer" ("AnswerId","answerCode","answer","QuestionId","isCorrect","justification") VALUES
(801,'A801_A','Providing participants with printed consent forms in English before any session.',8,false,
 'Written English consent forms are often inaccessible to San community members and do not reflect the community-first engagement protocols Kapuire et al. document.'),
(802,'A801_B','Conducting all design sessions remotely via video call to avoid disrupting village life.',8,false,
 'Remote engagement bypasses the community presence and relationship-building that Kapuire et al. (2018) identify as foundational to ethical co-design in these contexts.'),
(803,'A801_C','Engaging community elders first and obtaining their endorsement before any design work begins.',8,true,
 'Correct. Kapuire et al. (2018) establish that elder-first engagement in San community co-design is not a courtesy — it is a protocol requirement. Bypassing it invalidates the co-design process ethically (INTERACT 2017, pp. 401–420).'),
(804,'A801_D','Paying all participants a market-rate fee for their time to ensure equitable exchange.',8,false,
 'Compensation ethics is important but is not the specific engagement protocol Kapuire et al. identify as the primary ethical requirement in this context.')
ON CONFLICT ("answerCode") DO NOTHING;

INSERT INTO "CourseNoteHint" ("CourseNoteHintId","courseNoteHintCode","QuestionId","noteText","isActive") VALUES
(8,'CNH08','8',
'Kapuire et al. (2018) document the protocols they developed through years of community-based work in Namibia. In communities structured around elder authority — including many San communities — beginning design engagement with younger members or outsiders first is not simply impolite; it actively violates the community''s governance structure and can delegitimise the entire co-design process.',
true)
ON CONFLICT ("courseNoteHintCode") DO NOTHING;

INSERT INTO "PhoneAPeerHint" ("PhoneAPeerHintId","phoneAPeerHintCode","QuestionId","avatarName","hintText","isActive") VALUES
(8,'PPH08','8','Kwame',
'The question asks what is "ethically required, not merely polite." This is a strong phrase. Think about who holds decision-making authority in many Southern African communities, and what happens if you bypass that authority at the start.',
true)
ON CONFLICT ("phoneAPeerHintCode") DO NOTHING;

INSERT INTO "Question" ("QuestionId","questionCode","question","CategoryId","PrizeLevelId","isActive")
VALUES (9,'Q09_ETHICS_MED',
'Lazem et al. (2022) identify a core paradox in decolonising HCI. Which statement best captures that paradox?',
4,9,true)
ON CONFLICT ("questionCode") DO NOTHING;

INSERT INTO "Answer" ("AnswerId","answerCode","answer","QuestionId","isCorrect","justification") VALUES
(901,'A901_A','African researchers must publish in Western journals to be heard, but doing so reinforces the same academic hierarchies they are challenging.',9,true,
 'Correct. Lazem et al. (2022) identify this as a central paradox: decolonial HCI scholars must use the tools and venues of the dominant system (English-language Western publications) to critique that system, which perpetuates the very hierarchy they challenge (CSCW, 31(2), 159–196).'),
(902,'A901_B','African users prefer Western interfaces but are required by governments to use local designs.',9,false,
 'This is a fictional scenario that does not reflect the paradox Lazem et al. describe. Their paradox is about academic knowledge production, not user interface preference.'),
(903,'A901_C','Open-source software is free but requires technical skills unavailable in African communities.',9,false,
 'The digital skills gap is a real issue but is not the specific paradox Lazem et al. (2022) articulate in their critical discussion of decolonising HCI.'),
(904,'A901_D','Mobile-first design works in Africa but reduces the complexity of systems that researchers can study.',9,false,
 'This conflates a usability tradeoff with the decolonial paradox. The paradox Lazem et al. describe is epistemological, not about interface complexity.')
ON CONFLICT ("answerCode") DO NOTHING;

INSERT INTO "CourseNoteHint" ("CourseNoteHintId","courseNoteHintCode","QuestionId","noteText","isActive") VALUES
(9,'CNH09','9',
'Lazem et al. (2022) do not simply critique Western HCI — they also critically examine the constraints facing African scholars trying to build alternatives. The publication paradox is one example: CHI and CSCW are the most impactful venues for HCI research, but they are organised around Western academic conventions. Writing in these venues to argue against those conventions is inherently contradictory.',
true)
ON CONFLICT ("courseNoteHintCode") DO NOTHING;

INSERT INTO "PhoneAPeerHint" ("PhoneAPeerHintId","phoneAPeerHintCode","QuestionId","avatarName","hintText","isActive") VALUES
(9,'PPH09','9','Nadia',
'A paradox is a contradiction built into the situation itself. Think about what decolonial researchers need to do in order to be heard in the global HCI community, and then think about whether that act itself creates a contradiction.',
true)
ON CONFLICT ("phoneAPeerHintCode") DO NOTHING;

INSERT INTO "Question" ("QuestionId","questionCode","question","CategoryId","PrizeLevelId","isActive")
VALUES (10,'Q10_DIGITALWB_MED',
'In HCI Millionaire, the "Learn First" hub was added after survey data showed 46.1% of respondents had low familiarity with AVT content. Which specific well-being principle from Al-Mansoori et al. (2023) does this feature most directly address?',
5,10,true)
ON CONFLICT ("questionCode") DO NOTHING;

INSERT INTO "Answer" ("AnswerId","answerCode","answer","QuestionId","isCorrect","justification") VALUES
(1001,'A1001_A','Preventing cognitive overload by limiting the amount of new information per session.',10,false,
 'Cognitive load management is part of good interaction design, but it is not the specific well-being principle the Learn First hub addresses in relation to excluded users.'),
(1002,'A1001_B','Ensuring positivity and personal growth by preventing exclusion of unfamiliar users.',10,true,
 'Correct. Al-Mansoori et al. (2023) define digital well-being as technology that promotes positivity and growth. A game that begins with competitive questions for players who have never seen the content produces anxiety, not growth. The Learn First hub removes this exclusion barrier (Human Behavior and Emerging Technologies, 2023).'),
(1003,'A1001_C','Reducing screen time by providing offline-readable study cards.',10,false,
 'Screen time management is a digital well-being concern in some frameworks, but it is not the principle the Learn First hub is designed to address.'),
(1004,'A1001_D','Protecting user privacy by not requiring account creation to access study materials.',10,false,
 'Privacy is an ethical design concern but is separate from the well-being argument for the Learn First hub made in the project design document.')
ON CONFLICT ("answerCode") DO NOTHING;

INSERT INTO "CourseNoteHint" ("CourseNoteHintId","courseNoteHintCode","QuestionId","noteText","isActive") VALUES
(10,'CNH10','10',
'Al-Mansoori et al. (2023) define digital well-being as technology use that promotes positivity, personal growth, and balanced engagement rather than anxiety or overload. A direct-to-quiz experience for users with no prior exposure to AVT810S content would do the opposite: it would produce immediate failure, frustration, and disengagement. The Learn First hub is a structural response to that risk.',
true)
ON CONFLICT ("courseNoteHintCode") DO NOTHING;

INSERT INTO "PhoneAPeerHint" ("PhoneAPeerHintId","phoneAPeerHintCode","QuestionId","avatarName","hintText","isActive") VALUES
(10,'PPH10','10','Amara',
'46.1% of users knew nothing about the course content. What happens to a user''s experience — and wellbeing — if they are thrown directly into a quiz they cannot answer? The Learn First hub exists to prevent that specific outcome.',
true)
ON CONFLICT ("phoneAPeerHintCode") DO NOTHING;

INSERT INTO "Question" ("QuestionId","questionCode","question","CategoryId","PrizeLevelId","isActive")
VALUES (11,'Q11_UBUNTU_HARD',
'Farao et al. (2024) map "communal ecologies" in participatory design for HCI. A design team applies this framework to a mobile banking app for Ovawambo communities in northern Namibia. Which design decision is most directly supported by the communal ecology framework?',
1,11,true)
ON CONFLICT ("questionCode") DO NOTHING;

INSERT INTO "Answer" ("AnswerId","answerCode","answer","QuestionId","isCorrect","justification") VALUES
(1101,'A1101_A','Designing a single-user account tied to a national ID to prevent fraud.',11,false,
 'A single-user, ID-tied account model reflects an individualist design assumption that conflicts with communal financial practices documented in many Namibian contexts.'),
(1102,'A1101_B','Building joint account features that reflect shared financial decision-making across household and kin networks.',11,true,
 'Correct. Farao et al. (2024) describe communal ecologies as the networked relationships through which communities organise resources and decisions. In Ovawambo contexts, financial decisions are often made across extended kin networks, and a communal ecology-informed app must accommodate joint stewardship, not only individual accounts (PDC 2024, Vol. 2, 225–229).'),
(1103,'A1101_C','Prioritising USSD compatibility so the app works on feature phones without smartphones.',11,false,
 'Feature phone compatibility is a valuable digital equity decision, but it reflects a connectivity constraint, not the communal ecology framework specifically.'),
(1104,'A1101_D','Using SeSotho as the primary interface language instead of English or Oshiwambo.',11,false,
 'Language localisation matters, but SeSotho is not the language of Ovawambo communities, and this option does not engage with the communal ecology concept.')
ON CONFLICT ("answerCode") DO NOTHING;

INSERT INTO "CourseNoteHint" ("CourseNoteHintId","courseNoteHintCode","QuestionId","noteText","isActive") VALUES
(11,'CNH11','11',
'Farao et al. (2024) use the term "communal ecologies" to describe the interconnected social and material relationships through which communities share resources, care, and decision-making authority. For financial technology in contexts where extended family networks manage money collectively, a purely individual-account model is not neutral — it actively disrupts existing communal resource management structures.',
true)
ON CONFLICT ("courseNoteHintCode") DO NOTHING;

INSERT INTO "PhoneAPeerHint" ("PhoneAPeerHintId","phoneAPeerHintCode","QuestionId","avatarName","hintText","isActive") VALUES
(11,'PPH11','11','Kwame',
'A "communal ecology" is about how people are networked together in resource sharing and decisions. In many Namibian communities, money is managed across households, not by one individual. Which answer reflects that reality?',
true)
ON CONFLICT ("phoneAPeerHintCode") DO NOTHING;

INSERT INTO "Question" ("QuestionId","questionCode","question","CategoryId","PrizeLevelId","isActive")
VALUES (12,'Q12_PHILSAG_HARD',
'Henry Odera Oruka distinguished four trends in African philosophy. A colleague claims that recording and publishing the traditional proverbs and stories of the Himba people constitutes "philosophy." Oruka would classify this as which trend — and why is that classification significant for HCI co-design?',
2,12,true)
ON CONFLICT ("questionCode") DO NOTHING;

INSERT INTO "Answer" ("AnswerId","answerCode","answer","QuestionId","isCorrect","justification") VALUES
(1201,'A1201_A','Philosophical Sagacity — because Himba elders are critical thinkers who reason beyond tradition.',12,false,
 'Philosophical Sagacity requires individual critical reasoning that evaluates and sometimes challenges the tradition. Simply recording proverbs does not meet this standard — it describes Ethnophilosophy.'),
(1202,'A1201_B','Ethnophilosophy — because it treats communal oral tradition as collective worldview, not critical individual reasoning.',12,true,
 'Correct. Oruka classified the documentation of communal proverbs and stories as Ethnophilosophy — the study of a group''s collective worldview. This is philosophically significant for HCI: treating communities only as sources of oral tradition risks reducing living cultures to data repositories, rather than engaging them as critical knowledge partners (Afolayan & Falola, 2017, Palgrave Handbook of African Philosophy).'),
(1203,'A1201_C','Nationalist-ideological philosophy — because it serves to affirm Himba cultural identity against colonial erasure.',12,false,
 'Nationalist-ideological philosophy in Oruka''s framework refers to politically motivated philosophical work, not the documentation of oral tradition per se.'),
(1204,'A1201_D','Professional philosophy — because it follows academic publication and documentation standards.',12,false,
 'Professional philosophy in Oruka''s taxonomy refers to trained academic philosophers working in formal traditions. Recording oral proverbs does not meet this criterion regardless of publication format.')
ON CONFLICT ("answerCode") DO NOTHING;

INSERT INTO "CourseNoteHint" ("CourseNoteHintId","courseNoteHintCode","QuestionId","noteText","isActive") VALUES
(12,'CNH12','12',
'Oruka''s four trends are: (1) Ethnophilosophy — collective oral worldviews; (2) Philosophical Sagacity — critical individual reasoning within cultural tradition; (3) Nationalist-ideological philosophy — philosophy in service of African political identity; (4) Professional philosophy — academic philosophy by trained practitioners. The distinction between (1) and (2) is crucial in HCI: Ethnophilosophy risks treating communities as passive sources; Philosophical Sagacity treats them as active critical partners.',
true)
ON CONFLICT ("courseNoteHintCode") DO NOTHING;

INSERT INTO "PhoneAPeerHint" ("PhoneAPeerHintId","phoneAPeerHintCode","QuestionId","avatarName","hintText","isActive") VALUES
(12,'PPH12','12','Nadia',
'The key is what the activity involves: recording what a community collectively says and believes, or engaging an individual who critically reasons about that tradition. Recording proverbs is the first kind. What does Oruka call that category?',
true)
ON CONFLICT ("phoneAPeerHintCode") DO NOTHING;

INSERT INTO "Question" ("QuestionId","questionCode","question","CategoryId","PrizeLevelId","isActive")
VALUES (13,'Q13_AFRICANHCI_HARD',
'Mdwaba et al. (2023) argue for decolonising the computing curriculum. A university proposes to do this by adding one African case study to an otherwise unchanged HCI course. Mdwaba et al. would most likely describe this as which kind of failure?',
3,13,true)
ON CONFLICT ("questionCode") DO NOTHING;

INSERT INTO "Answer" ("AnswerId","answerCode","answer","QuestionId","isCorrect","justification") VALUES
(1301,'A1301_A','A curricular tokenism — adding African content without changing the foundational epistemological structure of the course.',13,true,
 'Correct. Mdwaba et al. (2023) argue that decolonising the curriculum requires aligning stakeholders and restructuring what counts as valid knowledge in computing — not adding a single African case study to a Western-structured course. Adding one case study while leaving everything else unchanged is tokenism, not decolonisation (AfriCHI 2023, pp. 278–284).'),
(1302,'A1301_B','A resource allocation failure — the university should hire more African faculty before changing the curriculum.',13,false,
 'Faculty representation is important but is not the specific critique Mdwaba et al. make about the one-case-study approach. Their argument is about epistemological structure, not staffing.'),
(1303,'A1301_C','A legal compliance failure — the university does not meet national language policy requirements.',13,false,
 'Language policy is a separate institutional concern. Mdwaba et al.''s argument is philosophical and pedagogical, not about legal compliance.'),
(1304,'A1301_D','A missed opportunity — the case study should be from a West African context rather than a Southern African one.',13,false,
 'Geographic specificity of the case study is not the point of Mdwaba et al.''s critique. The problem is structural, not about which African region is represented.')
ON CONFLICT ("answerCode") DO NOTHING;

INSERT INTO "CourseNoteHint" ("CourseNoteHintId","courseNoteHintCode","QuestionId","noteText","isActive") VALUES
(13,'CNH13','13',
'Mdwaba et al. (2023) describe decolonisation as a process of structural alignment, not surface addition. A decolonised curriculum does not simply include African examples — it changes which ways of knowing are treated as foundational. A single African case study in a course that otherwise assumes Western users, Western values, and Western epistemology has not changed its foundation. It has applied a decorative element to an unchanged structure.',
true)
ON CONFLICT ("courseNoteHintCode") DO NOTHING;

INSERT INTO "PhoneAPeerHint" ("PhoneAPeerHintId","phoneAPeerHintCode","QuestionId","avatarName","hintText","isActive") VALUES
(13,'PPH13','13','Amara',
'Think about the difference between adding a picture to a wall and redesigning the room. Mdwaba et al. are arguing for redesigning the room. What do we call it when something is added to look inclusive without changing the underlying structure?',
true)
ON CONFLICT ("phoneAPeerHintCode") DO NOTHING;

INSERT INTO "Question" ("QuestionId","questionCode","question","CategoryId","PrizeLevelId","isActive")
VALUES (14,'Q14_ETHICS_HARD',
'The HCI Millionaire platform uses JWT authentication with short token expiry and stores no raw passwords. The design document states that performance data is not broadcast publicly to avoid "harmful ranking pressure." Which ethical principle from the course reading most directly justifies this second decision?',
4,14,true)
ON CONFLICT ("questionCode") DO NOTHING;

INSERT INTO "Answer" ("AnswerId","answerCode","answer","QuestionId","isCorrect","justification") VALUES
(1401,'A1401_A','GDPR compliance — public display of performance data may violate European data protection law.',14,false,
 'GDPR may apply in some contexts but is a Western legal framework. The design document cites Ubuntu values, not European regulation, as the justification for this decision.'),
(1402,'A1401_B','Ubuntu — individual achievement is meaningful only in relation to the community, not as public competitive ranking.',14,true,
 'Correct. The design document cites Stapleton (2008) and Ubuntu values: individual rankings that create harmful pressure violate the Ubuntu principle that achievement is relational and communal, not a public competition against peers. The platform deliberately withholds public ranking to protect collective well-being (Stapleton, 2008, AI & Society, 22(3), 405–429).'),
(1403,'A1401_C','Ma''at — truth and balance require that all performance data be equally visible to all users.',14,false,
 'Ma''at''s emphasis on balance does not require universal public display of personal data. Hiding harmful rankings can itself be a form of balance.'),
(1404,'A1401_D','Philosophical Sagacity — only community elders should be authorised to view student performance data.',14,false,
 'Philosophical Sagacity concerns knowledge authority, not data access control. The justification for hiding rankings comes from Ubuntu''s communal ethic, not from Oruka''s framework.')
ON CONFLICT ("answerCode") DO NOTHING;

INSERT INTO "CourseNoteHint" ("CourseNoteHintId","courseNoteHintCode","QuestionId","noteText","isActive") VALUES
(14,'CNH14','14',
'Stapleton (2008) examines ethical decision-making in technology development and notes that competitive ranking systems can create harmful social dynamics in communal contexts. When individual rankings are publicly broadcast in a learning community, they can damage relationships and create the kind of social isolation that Ubuntu explicitly guards against. The design decision to keep performance private (except at the individual profile level) is a structural Ubuntu-informed choice.',
true)
ON CONFLICT ("courseNoteHintCode") DO NOTHING;

INSERT INTO "PhoneAPeerHint" ("PhoneAPeerHintId","phoneAPeerHintCode","QuestionId","avatarName","hintText","isActive") VALUES
(14,'PPH14','14','Kwame',
'The question is about why public rankings might cause "harmful pressure" in this specific learning community. Which African philosophy specifically argues that individual achievement should not be separated from or set against the community? That philosophy is the justification.',
true)
ON CONFLICT ("phoneAPeerHintCode") DO NOTHING;

INSERT INTO "Question" ("QuestionId","questionCode","question","CategoryId","PrizeLevelId","isActive")
VALUES (15,'Q15_DIGITALWB_HARD',
'Peters et al. (2014) describe a "hitchhiker''s guide" to collaborating with African communities. A team building on this work identifies the most important unmet standard in HCI Millionaire''s current development process. What is that standard — and why does the project''s own design document acknowledge it as the highest-priority future direction?',
5,15,true)
ON CONFLICT ("questionCode") DO NOTHING;

INSERT INTO "Answer" ("AnswerId","answerCode","answer","QuestionId","isCorrect","justification") VALUES
(1501,'A1501_A','Translating all interface text into indigenous Namibian languages before the next release.',15,false,
 'Localisation is a worthwhile goal but is not identified in the design document as the highest-priority unmet participatory design standard. Peters et al.''s framework is about co-design process, not translation.'),
(1502,'A1501_B','Conducting structured co-design workshops with members of the San, Ovawambo, and Himba communities whose knowledge appears in the question bank.',15,true,
 'Correct. The design document explicitly states: "The most important long-term design goal is to expand [the question bank] through structured co-design workshops with AVT810S lecturers, current and former students, and representatives of the communities featured in the case studies." Peters et al. (2014) argue that communities must be partners from the beginning, not subjects of completed questions. The current platform uses academic citations about these communities rather than content co-created with them (CHI 2014 Extended Abstracts, pp. 1969–1974).'),
(1503,'A1501_C','Publishing the full source code under a Creative Commons licence so any community can adapt it.',15,false,
 'Open-source licensing supports access and adaptability but is not the participatory co-design standard Peters et al. describe, nor is it the priority identified in the design document.'),
(1504,'A1501_D','Deploying adaptive difficulty powered by a machine learning model trained on player performance data.',15,false,
 'Adaptive difficulty is identified as a future technical goal, but the design document explicitly notes that any ML implementation would need to be evaluated for algorithmic bias. It is not the highest-priority direction — community co-design is.')
ON CONFLICT ("answerCode") DO NOTHING;

INSERT INTO "CourseNoteHint" ("CourseNoteHintId","courseNoteHintCode","QuestionId","noteText","isActive") VALUES
(15,'CNH15','15',
'Peters et al. (2014) argue that genuine participatory design with African communities requires communities to be partners from the start of the process, not subjects whose practices are studied and then represented by outside researchers. HCI Millionaire currently uses academic papers about San, Ovawambo, Himba, and Maasai communities to create quiz questions. This is a meaningful step, but it does not yet meet the standard of co-design: the communities themselves have not yet shaped the questions that represent their knowledge.',
true)
ON CONFLICT ("courseNoteHintCode") DO NOTHING;

INSERT INTO "PhoneAPeerHint" ("PhoneAPeerHintId","phoneAPeerHintCode","QuestionId","avatarName","hintText","isActive") VALUES
(15,'PPH15','15','Nadia',
'Peters et al. are about participatory design — who gets to shape the design process, not just benefit from it. The current game has questions about specific Namibian communities. But were members of those communities involved in writing those questions? That gap is your answer.',
true)
ON CONFLICT ("phoneAPeerHintCode") DO NOTHING;

