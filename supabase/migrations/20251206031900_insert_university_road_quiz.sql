-- Migration: insert_university_road_quiz
-- Created: 2025-12-06
-- Description: Insert quiz data for topic '大学之路' (The Road to University)
-- Note: Assumes topic '大学之路' already exists in the database

-- Question 1
WITH topic_lookup AS (
  SELECT id FROM topics WHERE name = '大学之路' ORDER BY id DESC LIMIT 1
),
new_question AS (
  INSERT INTO questions (content, weight, topic_id, has_multiple_answers, hint, created_at, updated_at)
  SELECT '根据作者吴军的观点，为什么许多从所谓名校毕业的学生在事业进展到一半时并未达到预期，反而将期望寄托在孩子身上？', NULL, topic_lookup.id, false, '思考作者在"前言"中反复强调的"人生是场马拉松"这一比喻的核心含义。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  FROM topic_lookup
  RETURNING id
)
INSERT INTO answers (content, correct, question_id, rationale, created_at, updated_at)
SELECT * FROM (VALUES
  ('因为他们就读的大学名不副实，没有提供优质的教育资源。', false, (SELECT id FROM new_question), '书中并未将问题归咎于大学教育质量本身，而是指向了学生对教育意义的理解。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('因为他们对教育的理解出现偏差，认为获得名校学位即是教育的终点。', true, (SELECT id FROM new_question), '作者在前言中明确指出，根本原因在于亚裔对教育理念的理解出现偏差，把名校毕业当作终点而非起点，违背了终身学习的原则。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('因为他们在大学期间过于注重课外活动，忽视了专业知识的学习。', false, (SELECT id FROM new_question), '作者反而强调了课外活动对培养综合能力的重要性，并未将其视为事业失败的原因。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('因为社会竞争过于激烈，即使是名校毕业生也难以获得成功。', false, (SELECT id FROM new_question), '作者认为成功的道路并不拥挤，关键在于能否坚持终身学习，而非外部竞争。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
) AS v(content, correct, question_id, rationale, created_at, updated_at);

-- Question 2
WITH topic_lookup AS (
  SELECT id FROM topics WHERE name = '大学之路' ORDER BY id DESC LIMIT 1
),
new_question AS (
  INSERT INTO questions (content, weight, topic_id, has_multiple_answers, hint, created_at, updated_at)
  SELECT '书中对比了约翰·纽曼（John Newman）和洪堡（Humboldt）的教育理念。以下哪项最准确地描述了纽曼式大学的精髓？', NULL, topic_lookup.id, false, '回想纽曼的名言，他宁愿选择一所没有教授、让年轻人共同生活三四年的大学。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  FROM topic_lookup
  RETURNING id
)
INSERT INTO answers (content, correct, question_id, rationale, created_at, updated_at)
SELECT * FROM (VALUES
  ('强调"研究教学合一"，学生毕业时需对某个专业有精深的了解。', false, (SELECT id FROM new_question), '这是洪堡体系的核心特征，旨在培养能直接服务于工业社会的专才。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('以传授"大行之道"（Universal Knowledge）为核心，重视学生间的相互学习和社交生活。', true, (SELECT id FROM new_question), '纽曼认为，让聪明的年轻人生活在一起相互学习，比单纯的课堂教学更能培养出服务于社会的精英。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('将高等教育分为本科的通才教育和研究生的专才教育两个阶段。', false, (SELECT id FROM new_question), '这种结合模式是吉尔曼和艾略特等美国教育家借鉴并发展后的产物，而非纽曼理念的原始核心。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('优先发展工科和应用科学，以满足国家工业化发展的迫切需求。', false, (SELECT id FROM new_question), '这种务实的办学方向更符合洪堡体系以及美国第二波私立大学的特点。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
) AS v(content, correct, question_id, rationale, created_at, updated_at);

-- Question 3
WITH topic_lookup AS (
  SELECT id FROM topics WHERE name = '大学之路' ORDER BY id DESC LIMIT 1
),
new_question AS (
  INSERT INTO questions (content, weight, topic_id, has_multiple_answers, hint, created_at, updated_at)
  SELECT '作者在分析美国私立名校招生不公平时指出，最初设计"综合素质考察"等非成绩因素，其历史根源是为了限制哪个族裔的学生入学？', NULL, topic_lookup.id, false, '思考一下，在亚裔成为"新犹太人"之前，哪个族裔曾因学习成绩优异而被名校视为威胁？', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  FROM topic_lookup
  RETURNING id
)
INSERT INTO answers (content, correct, question_id, rationale, created_at, updated_at)
SELECT * FROM (VALUES
  ('亚裔学生', false, (SELECT id FROM new_question), '亚裔学生是当前该制度下的主要受影响者，但书中指出他们是"新犹太人"，说明此制度早已有之。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('犹太裔学生', true, (SELECT id FROM new_question), '书中明确提到，20世纪初，为了应对入学成绩优异的犹太裔学生比例激增，哈佛等校开始采用"综合考查"来限制其入学。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('非洲裔学生', false, (SELECT id FROM new_question), '书中提到，在民权运动后，为了照顾非洲裔学生，学术因素在录取中的权重被进一步降低，但他们不是最初被限制的对象。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('拉丁裔学生', false, (SELECT id FROM new_question), '拉丁裔学生和非洲裔学生一样，通常是在平权法案下受到照顾的群体，而非被限制的对象。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
) AS v(content, correct, question_id, rationale, created_at, updated_at);

-- Question 4
WITH topic_lookup AS (
  SELECT id FROM topics WHERE name = '大学之路' ORDER BY id DESC LIMIT 1
),
new_question AS (
  INSERT INTO questions (content, weight, topic_id, has_multiple_answers, hint, created_at, updated_at)
  SELECT '关于剑桥和牛津的学院制（Constituent College），以下哪个描述是错误的？', NULL, topic_lookup.id, false, '请区分作为生活社区的"学院"（College）和作为学术单位的"系"（Department）的功能。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  FROM topic_lookup
  RETURNING id
)
INSERT INTO answers (content, correct, question_id, rationale, created_at, updated_at)
SELECT * FROM (VALUES
  ('学院拥有独立的财务和管理权，学生和教授都参与学院管理，大学不能随意干预。', false, (SELECT id FROM new_question), '书中提到学院在财务和管理上非常独立，甚至拥有巨额资产，这是学院制的核心特征之一。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('学生被大学录取后，还必须被某个学院接收才能正式入学，且顶尖学院的竞争非常激烈。', false, (SELECT id FROM new_question), '书中描述了这种两级录取制度，被大学录取不等于被学院接收，这是其独特之处。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('学院的主要功能是按学科划分，如工学院、理学院，负责学生的专业课程教学。', true, (SELECT id FROM new_question), '这混淆了学院（College）和系（Department）/学术学院（School）的概念。学院是生活与学习的社区，而专业教学主要由系负责。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('许多教授也住在学院里，与学生关系密切，扮演着亦师亦友的角色，这有助于全方位育人。', false, (SELECT id FROM new_question), '这是学院制育人理念的体现，旨在促进师生在课本知识之外的交流与学习。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
) AS v(content, correct, question_id, rationale, created_at, updated_at);

-- Question 5
WITH topic_lookup AS (
  SELECT id FROM topics WHERE name = '大学之路' ORDER BY id DESC LIMIT 1
),
new_question AS (
  INSERT INTO questions (content, weight, topic_id, has_multiple_answers, hint, created_at, updated_at)
  SELECT '在美国研究型大学的管理结构中，"教授治校"的传统主要体现在哪个层面？', NULL, topic_lookup.id, false, '思考教授们在日常管理中实际拥有的、最直接的权力范围。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  FROM topic_lookup
  RETURNING id
)
INSERT INTO answers (content, correct, question_id, rationale, created_at, updated_at)
SELECT * FROM (VALUES
  ('大学校长和教务长等最高层管理者必须由资深教授担任。', false, (SELECT id FROM new_question), '校长和教务长是专职行政职务，虽然他们过去可能是学者，但治校传统并非体现在高层职位的必然任命上。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('系一级的制度制定与执行，如招生、教授晋级等事务由系内教授委员会决定。', true, (SELECT id FROM new_question), '书中明确指出，教授治校主要体现在系一级，通过各种委员会管理日常事务，保证了学术独立和民主公正。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('学校的董事会（Board of Trustees）必须由超过半数的教授代表组成。', false, (SELECT id FROM new_question), '董事会成员主要是社会精英、企业家和校友，代表社会管理大学，而非教授群体。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('所有科研经费的分配和使用完全由教授组成的委员会投票决定，不受行政干预。', false, (SELECT id FROM new_question), '科研经费通常是跟着教授个人或项目走的，其分配主要取决于外部资助机构，而非校内教授委员会的投票。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
) AS v(content, correct, question_id, rationale, created_at, updated_at);

-- Question 6
WITH topic_lookup AS (
  SELECT id FROM topics WHERE name = '大学之路' ORDER BY id DESC LIMIT 1
),
new_question AS (
  INSERT INTO questions (content, weight, topic_id, has_multiple_answers, hint, created_at, updated_at)
  SELECT '书中提到，美国一流私立大学的财务来源多样，以下哪项通常不是其主要的收入来源？', NULL, topic_lookup.id, false, '想一想，哪一项收入被作者描述为"除了斯坦福大学，各大学这一块的收入所占经费比例都不高"？', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  FROM topic_lookup
  RETURNING id
)
INSERT INTO answers (content, correct, question_id, rationale, created_at, updated_at)
SELECT * FROM (VALUES
  ('校友和社会捐赠', false, (SELECT id FROM new_question), '捐赠是私立名校至关重要的收入来源，用于补贴教学、建设和设立奖学金。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('政府和企业的研究经费', false, (SELECT id FROM new_question), '对于研究型大学，科研经费及其管理费是相当大的一笔收入，甚至超过学费。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('技术转让费和专利收入', true, (SELECT id FROM new_question), '书中特别指出，除了斯坦福大学等少数例外，大部分大学的这项收入所占比例并不高。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('学生的学费', false, (SELECT id FROM new_question), '学费虽然是一项收入，但由于名校提供高额的助学金，实际人均学费远不足以覆盖培养成本，需要其他收入来补贴。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
) AS v(content, correct, question_id, rationale, created_at, updated_at);

-- Question 7
WITH topic_lookup AS (
  SELECT id FROM topics WHERE name = '大学之路' ORDER BY id DESC LIMIT 1
),
new_question AS (
  INSERT INTO questions (content, weight, topic_id, has_multiple_answers, hint, created_at, updated_at)
  SELECT '作者认为，亚裔学生在申请美国顶尖私立大学时面临额外困难，除了大学招生政策本身的不公，亚裔群体自身存在的主要问题是什么？', NULL, topic_lookup.id, false, '思考一下私立大学的运营模式，它们非常依赖于哪个群体的支持？', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  FROM topic_lookup
  RETURNING id
)
INSERT INTO answers (content, correct, question_id, rationale, created_at, updated_at)
SELECT * FROM (VALUES
  ('亚裔学生的课外活动不够丰富，只专注于学习成绩。', false, (SELECT id FROM new_question), '虽然这是一个普遍印象，但作者更深入地分析了亚裔群体在社会层面的问题。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('对大学的贡献严重不足，包括捐款和参与校友活动等方面。', true, (SELECT id FROM new_question), '书中明确指出亚裔对大学"只使用不建设"，捐款比例远低于其学生比例，这影响了大学对该群体的招生倾向。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('语言和文化障碍导致面试表现不佳，不善于自我推销。', false, (SELECT id FROM new_question), '这确实是一个问题，但作者认为更根本的问题在于亚裔群体与大学的互动模式。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('亚裔家庭给孩子施加的压力过大，导致孩子缺乏独立思考能力。', false, (SELECT id FROM new_question), '这是作者在讨论教育理念时提到的问题，但在分析招生困境时，他更侧重于群体行为的经济和政治原因。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
) AS v(content, correct, question_id, rationale, created_at, updated_at);

-- Question 8
WITH topic_lookup AS (
  SELECT id FROM topics WHERE name = '大学之路' ORDER BY id DESC LIMIT 1
),
new_question AS (
  INSERT INTO questions (content, weight, topic_id, has_multiple_answers, hint, created_at, updated_at)
  SELECT '普林斯顿大学的住宿学院制（Residential College）与牛津、剑桥的构成学院制（Constituent College）相比，一个显著的不同点在于？', NULL, topic_lookup.id, false, '从学院的自主权和与大学的从属关系角度思考二者的差异。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  FROM topic_lookup
  RETURNING id
)
INSERT INTO answers (content, correct, question_id, rationale, created_at, updated_at)
SELECT * FROM (VALUES
  ('普林斯顿的学院完全按专业划分，而牛津剑桥的学院则混合了所有专业的学生。', false, (SELECT id FROM new_question), '普林斯顿的学院制恰恰是为了融合不同专业的学生，这一点与牛津剑桥的理念相似。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('普林斯顿的学院在财务和管理上不像牛津剑桥的学院那样独立，更像是大学统一管理下的生活社区。', true, (SELECT id FROM new_question), '书中提到牛津剑桥的学院拥有独立的财务和管理权，而普林斯顿的学院则没有那么独立，学生的分配也由学校决定。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('普林斯顿的学院只提供住宿，所有教学活动都在系里进行；而牛津剑桥的部分教学在学院内完成。', false, (SELECT id FROM new_question), '两者的模式都包含学院内的辅导（Tutorials）和系里的授课（Lectures），并非完全分离。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('普林斯顿的学院只有本科生居住，而牛津剑桥的学院则包含大量研究生和教授。', false, (SELECT id FROM new_question), '两者都有教授居住在学院内，以促进师生交流，这是学院制的重要特征。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
) AS v(content, correct, question_id, rationale, created_at, updated_at);

-- Question 9
WITH topic_lookup AS (
  SELECT id FROM topics WHERE name = '大学之路' ORDER BY id DESC LIMIT 1
),
new_question AS (
  INSERT INTO questions (content, weight, topic_id, has_multiple_answers, hint, created_at, updated_at)
  SELECT '根据书中描述，教育家艾略特（Charles William Eliot）对哈佛大学进行了重大改革。他的核心贡献是什么？', NULL, topic_lookup.id, false, '思考一下哈佛大学如今开设6000多门课程的传统源于哪位校长的办学理念。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  FROM topic_lookup
  RETURNING id
)
INSERT INTO answers (content, correct, question_id, rationale, created_at, updated_at)
SELECT * FROM (VALUES
  ('创立了美国第一所研究型大学，建立了研究生院制度。', false, (SELECT id FROM new_question), '创立美国第一所研究型大学和研究生院的是约翰·霍普金斯大学的第一任校长吉尔曼（Daniel Gilman）。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('将大学从"以教为主"转变为"以学为主"，极大丰富了课程选择，推动了通才教育。', true, (SELECT id FROM new_question), '艾略特主张学生想学什么，学校就应该教什么，并因此在哈佛开设了数千门课程，这是他改革的核心。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('引入了住宿学院制，模仿英国大学模式来加强学生社区建设。', false, (SELECT id FROM new_question), '引入住宿学院制的是普林斯顿和耶鲁等大学，哈佛的宿舍介于其间，但这不是艾略特改革的核心。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('确立了教授治校和终身教职制度，以保障学术自由。', false, (SELECT id FROM new_question), '终身教职制度是美国教授协会和多位校长共同推动的结果，并非艾略特一人的标志性贡献。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
) AS v(content, correct, question_id, rationale, created_at, updated_at);

-- Question 10
WITH topic_lookup AS (
  SELECT id FROM topics WHERE name = '大学之路' ORDER BY id DESC LIMIT 1
),
new_question AS (
  INSERT INTO questions (content, weight, topic_id, has_multiple_answers, hint, created_at, updated_at)
  SELECT '作者在书中引用了约翰·纽曼的一段话，对比两种大学模式。纽曼会毫不犹豫地选择哪一种？', NULL, topic_lookup.id, false, '纽曼最看重的是学生群体本身所能产生的教育力量。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  FROM topic_lookup
  RETURNING id
)
INSERT INTO answers (content, correct, question_id, rationale, created_at, updated_at)
SELECT * FROM (VALUES
  ('由老师管着、选够学分就能毕业的大学。', false, (SELECT id FROM new_question), '这是纽曼批评的功利化教育模式，他认为这种模式缺乏教育的真正内涵。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('没有教授和考试，让年轻人在一起共同生活、互相学习三四年的大学。', true, (SELECT id FROM new_question), '纽曼认为，聪明的年轻人聚集在一起相互学习、交流思想，其教育价值高于单纯的课堂教学。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('以研究为中心，所有教学都围绕前沿科研项目展开的大学。', false, (SELECT id FROM new_question), '这是洪堡体系的特点，强调研究和专业知识，与纽曼的通才教育理念不同。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('课程设置极为严格，学生必须在某一专业领域达到顶尖水平的大学。', false, (SELECT id FROM new_question), '这种专才教育模式与纽曼所倡导的开阔视野、培养全面素质的"大行之道"相悖。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
) AS v(content, correct, question_id, rationale, created_at, updated_at);

-- Question 11
WITH topic_lookup AS (
  SELECT id FROM topics WHERE name = '大学之路' ORDER BY id DESC LIMIT 1
),
new_question AS (
  INSERT INTO questions (content, weight, topic_id, has_multiple_answers, hint, created_at, updated_at)
  SELECT '作者认为，对于申请美国私立名校的高中生来说，以下哪种"特长"在招生官眼中价值最低？', NULL, topic_lookup.id, false, '思考哪种行为缺乏真实的热情和持久性，更像是一种投机取巧的包装。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  FROM topic_lookup
  RETURNING id
)
INSERT INTO answers (content, correct, question_id, rationale, created_at, updated_at)
SELECT * FROM (VALUES
  ('在NCAA第一组别的团队体育项目中担任校队主力.', false, (SELECT id FROM new_question), '团队体育项目，特别是NCAA项目，是大学非常看重的特长，因为它直接关系到校队的实力。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('为了迎合招生趋势，功利性地去贫困地区短期做义工。', true, (SELECT id FROM new_question), '作者明确指出，这种功利性太强的"人造"经历很容易被识破，并且因为模仿者众多而失去了独特性和价值。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('在美国学生占多数的高中里，当选为学生会主席。', false, (SELECT id FROM new_question), '这能有力地证明申请者的领导能力和跨文化沟通能力，是备受名校青睐的特长。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('独立开发了一款拥有百万级用户的手机APP。', false, (SELECT id FROM new_question), '作者提到，像麻省理工这样的学校越来越看重这种能直接体现创造力和实践能力的项目。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
) AS v(content, correct, question_id, rationale, created_at, updated_at);

-- Question 12
WITH topic_lookup AS (
  SELECT id FROM topics WHERE name = '大学之路' ORDER BY id DESC LIMIT 1
),
new_question AS (
  INSERT INTO questions (content, weight, topic_id, has_multiple_answers, hint, created_at, updated_at)
  SELECT '关于美国大学的"终身教职"（Tenure），其设立的根本目的在于什么？', NULL, topic_lookup.id, false, '想一想，如果没有这个制度的保护，教授在发表与主流或权势相悖的观点时会面临什么风险？', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  FROM topic_lookup
  RETURNING id
)
INSERT INTO answers (content, correct, question_id, rationale, created_at, updated_at)
SELECT * FROM (VALUES
  ('为教授提供一个稳定的"铁饭碗"，让他们可以安心养老。', false, (SELECT id FROM new_question), '虽然客观上提供了职业稳定性，但这只是手段而非根本目的。书中提到，Tenure的本意并非强调铁饭碗。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('保障教授的学术自由，使他们可以独立思考，免受政治和资本的干预。', true, (SELECT id FROM new_question), '书中明确指出，设立终身教职是为了让教授能够静心从事教学科研，产生独立思想，而不必担心因观点不受欢迎而被解聘。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('作为一种激励机制，促使助理教授在规定年限内发表更多高质量论文。', false, (SELECT id FROM new_question), '获得终身教职的过程确实是一种激励，但制度本身的设计初衷是保障获得者之后的学术自由。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('提高大学教授的社会地位，吸引更多优秀人才放弃工业界的高薪进入学术界。', false, (SELECT id FROM new_question), '这是一种积极的副作用，但终身教职制度的核心价值在于保护学术研究的独立性。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
) AS v(content, correct, question_id, rationale, created_at, updated_at);

-- Question 13
WITH topic_lookup AS (
  SELECT id FROM topics WHERE name = '大学之路' ORDER BY id DESC LIMIT 1
),
new_question AS (
  INSERT INTO questions (content, weight, topic_id, has_multiple_answers, hint, created_at, updated_at)
  SELECT '作者在书中谈到，美国大学的毕业率普遍不高，例如斯坦福大学的四年毕业率仅为80%左右。造成这一现象的主要原因是什么？', NULL, topic_lookup.id, false, '思考一下美国大学文化中学生的主动性和选择权，以及他们对教育功利性的不同看法。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  FROM topic_lookup
  RETURNING id
)
INSERT INTO answers (content, correct, question_id, rationale, created_at, updated_at)
SELECT * FROM (VALUES
  ('大学课程难度极高，大量学生因成绩不合格而被学校开除。', false, (SELECT id FROM new_question), '书中明确提到"美国的大学一般没有因为成绩不好而主动开除学生的"。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('许多学生因经济困难，无法支付高昂的学费而被迫中断学业。', false, (SELECT id FROM new_question), '虽然经济是原因之一，但书中提到的更主要原因是学生对大学教育价值的主观判断和个人选择。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('大部分拿不到文凭的人是自己主动退学的，原因包括兴趣索然或认为不值得。', true, (SELECT id FROM new_question), '作者列举了多种主动退学的原因，如觉得学习吃力、学费不值（如乔布斯）、或认为上班挣钱更实在。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('大学招生标准过低，招收了许多不具备完成学业能力的学生。', false, (SELECT id FROM new_question), '名牌大学的招生标准极高，毕业率低并非因为生源质量差，而是学生在入学后的选择。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
) AS v(content, correct, question_id, rationale, created_at, updated_at);

-- Question 14
WITH topic_lookup AS (
  SELECT id FROM topics WHERE name = '大学之路' ORDER BY id DESC LIMIT 1
),
new_question AS (
  INSERT INTO questions (content, weight, topic_id, has_multiple_answers, hint, created_at, updated_at)
  SELECT '在对比英美顶尖大学时，埃斯勒（Jason Eisner）教授认为，尽管牛津剑桥也强调通才教育，但其实际效果却落后于哈佛等美国名校，其主要原因是什么？', NULL, topic_lookup.id, false, '作者在总结这一对比时，强调了"大学不仅要有大师，还要有大楼"这句话。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  FROM topic_lookup
  RETURNING id
)
INSERT INTO answers (content, correct, question_id, rationale, created_at, updated_at)
SELECT * FROM (VALUES
  ('英国大学的学术传统过于保守，不愿意开设跨学科的新课程。', false, (SELECT id FROM new_question), '虽然传统，但这并非作者引述的根本原因，更深层的原因在于物质基础。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('英国大学的资源（经费）不足，导致无法开设足够多的课程，并限制了学生跨专业选课。', true, (SELECT id FROM new_question), '埃斯勒教授认为主要是资源不足，限制了课程数量和实验条件，使得通才教育的理念无法像在美国名校那样充分落地。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('英国的导师制过于严格，限制了学生的自由发展和跨领域探索。', false, (SELECT id FROM new_question), '导师制旨在指导学生，虽然有一定约束，但并非是通才教育落后的主要原因。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('英国学生更倾向于深入学习单一专业，对跨学科学习缺乏兴趣。', false, (SELECT id FROM new_question), '这可能是结果而非原因，制度和资源上的限制是造成这种现象的重要因素。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
) AS v(content, correct, question_id, rationale, created_at, updated_at);
