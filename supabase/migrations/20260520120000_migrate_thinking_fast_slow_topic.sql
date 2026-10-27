-- Migrate topic "思考，快与慢" from develop to production:
-- topic + 7 assets + 10 questions + 40 answers.
-- Uses auto-generated IDs from prod sequences and stitches foreign keys via a DO block.
-- Idempotent: if a topic with the same name and author already exists, the migration exits without changes.

DO $$
DECLARE
  v_topic_id BIGINT;
  v_existing BIGINT;
  v_q56 BIGINT; v_q57 BIGINT; v_q58 BIGINT; v_q59 BIGINT; v_q60 BIGINT;
  v_q61 BIGINT; v_q62 BIGINT; v_q63 BIGINT; v_q64 BIGINT; v_q65 BIGINT;
BEGIN
  SELECT id INTO v_existing
  FROM topics
  WHERE name = '思考，快与慢' AND author = '丹尼尔·卡尼曼';

  IF v_existing IS NOT NULL THEN
    RAISE NOTICE 'Topic "思考，快与慢" already exists in production (id=%), skipping migration.', v_existing;
    RETURN;
  END IF;

  -- 1. Topic
  INSERT INTO topics (name, description, explaination, cover_url, current_fee, original_fee, author, category_id)
  VALUES (
    '思考，快与慢',
    '诺贝尔奖得主丹尼尔·卡尼曼（Daniel Kahneman, 1934–2024）的著作《思考，快与慢》（2011），分析了人类大脑的两种思维模式：系统1（快思考）和系统2（慢思考）。系统1：代表直觉与本能，运行迅速且无意识，负责处理日常感知，易受启动效应和认知偏见影响。系统2：代表逻辑与理性，运行缓慢且费力，负责复杂运算、自我控制及纠正直觉错误。文中通过瞳孔测量、心理实验及生活案例，揭示了由于系统2的懒惰，人类常依赖系统1，导致认知偏见。作者提供了一套语言工具，帮助识别并规避思维陷阱。通过对心流、自我损耗和联想激活等现象的探讨，文献展示了环境与生理状态如何操纵行为。这些研究挑战了传统经济学中理性人的假设，构建了行为经济学的理论基石。关键概念：锚定效应、可得性启发、前景理论（损失厌恶）、框架效应、过度自信、规划谬误、峰终定律、WYSIATI（眼见即全部）。本书综合了卡尼曼与阿莫斯·特沃斯基（Amos Tversky）数十年的合作研究，是行为经济学与决策科学的奠基性著作。',
    NULL,
    'cloud://learn-production-1fyzsv3105009f4.6c65-learn-production-1fyzsv3105009f4-1327392464/thinking-slow-fast/9-16-cover.png',
    199,
    999,
    '丹尼尔·卡尼曼',
    4
  )
  RETURNING id INTO v_topic_id;

  -- 2. Assets
  INSERT INTO assets (type, link, description, topic_id) VALUES
    (0, 'cloud://learn-production-1fyzsv3105009f4.6c65-learn-production-1fyzsv3105009f4-1327392464/thinking-slow-fast/info.png', NULL, v_topic_id),
    (2, 'cloud://learn-production-1fyzsv3105009f4.6c65-learn-production-1fyzsv3105009f4-1327392464/thinking-slow-fast/fast-slow.mp3', '《思考，快与慢》：诺贝尔奖得主卡尼曼揭示大脑两套思维系统与认知偏见，奠定行为经济学基石', v_topic_id),
    (3, 'cloud://learn-production-1fyzsv3105009f4.6c65-learn-production-1fyzsv3105009f4-1327392464/thinking-slow-fast/2.m4a', ' 《思考，快与慢》对谈：两人解读卡尼曼的系统1与系统2，聊聊认知偏见如何左右我们的日常决策。', v_topic_id),
    (4, 'cloud://learn-production-1fyzsv3105009f4.6c65-learn-production-1fyzsv3105009f4-1327392464/thinking-slow-fast/podcast_chunks/chunk_00.mp3', '快与慢：从锚定到沉没成本，5 个让你不知不觉走捷径的认知陷阱', v_topic_id),
    (4, 'cloud://learn-production-1fyzsv3105009f4.6c65-learn-production-1fyzsv3105009f4-1327392464/thinking-slow-fast/podcast_chunks/chunk_01.mp3', '后见之明、规划谬误与损失厌恶：6 个让你做错决策的隐藏偏见', v_topic_id),
    (4, 'cloud://learn-production-1fyzsv3105009f4.6c65-learn-production-1fyzsv3105009f4-1327392464/thinking-slow-fast/podcast_chunks/chunk_02.mp3', '峰终定律、WYSIATI 与禀赋效应：7 个塑造记忆与判断的心理捷径', v_topic_id),
    (4, 'cloud://learn-production-1fyzsv3105009f4.6c65-learn-production-1fyzsv3105009f4-1327392464/thinking-slow-fast/podcast_chunks/chunk_03.mp3', '收官：为什么"慢下来"是对抗思维陷阱最有效的工具', v_topic_id);

  -- 3. Questions
  INSERT INTO questions (content, weight, topic_id, has_multiple_answers, hint) VALUES
    ('根据书中对系统1和系统2的描述，下列关于大脑运作机制的说法中，哪一项是错误的？', 1, v_topic_id, false, '请回想书中提到的愤怒的脸和乘法题这两个例子分别代表了哪种思维模式。')
    RETURNING id INTO v_q56;
  INSERT INTO questions (content, weight, topic_id, has_multiple_answers, hint) VALUES
    ('关于看不见的大猩猩实验，该研究揭示了大脑在分配注意力时的哪项关键特征？', 1, v_topic_id, false, '考虑一下当你的大脑在进行短跑冲刺时，会如何处理次要的视觉信号。')
    RETURNING id INTO v_q57;
  INSERT INTO questions (content, weight, topic_id, has_multiple_answers, hint) VALUES
    ('在心理学家罗伊·鲍迈斯特关于自我损耗的研究中，下列哪项发现揭示了自我控制的能量来源？', 1, v_topic_id, false, '请联想保释官在餐前与餐后批准率出现剧烈波动的生物学原因。')
    RETURNING id INTO v_q58;
  INSERT INTO questions (content, weight, topic_id, has_multiple_answers, hint) VALUES
    ('在启动效应中，佛罗里达效应实验通过让学生重组与老年相关的词句，最终导致了什么结果？', 1, v_topic_id, false, '这种效应反映了概念是如何绕过意识直接影响物理行为的。')
    RETURNING id INTO v_q59;
  INSERT INTO questions (content, weight, topic_id, has_multiple_answers, hint) VALUES
    ('根据认知放松度理论，如果你想让读者更容易相信你所写的信息，下列哪项做法是不可取的？', 1, v_topic_id, false, '思考系统2的懒惰特性：它更倾向于处理哪类复杂程度的信息？')
    RETURNING id INTO v_q60;
  INSERT INTO questions (content, weight, topic_id, has_multiple_answers, hint) VALUES
    ('在普林斯顿大学进行的认知反应测试中，为什么使用浅灰色小字（导致认知紧张）的问卷组表现反而更好？', 1, v_topic_id, false, '考虑一下认知紧张如何作为一种警报信号来影响大脑的监管机制。')
    RETURNING id INTO v_q61;
  INSERT INTO questions (content, weight, topic_id, has_multiple_answers, hint) VALUES
    ('根据眼见即为事实（WYSIATI）原则，为什么人们在只有片面证据的情况下反而会表现出更高的自信？', 1, v_topic_id, false, '请回想一下，衡量判断成功标准的是故事的完整性还是连贯性？')
    RETURNING id INTO v_q62;
  INSERT INTO questions (content, weight, topic_id, has_multiple_answers, hint) VALUES
    ('在托多罗夫关于政治选举的研究中，为什么仅凭照片的能力评估就能高准确率预测竞选结果？', 1, v_topic_id, false, '请关注系统1在面对朋友还是敌人这类原始生存问题时的自动化反应。')
    RETURNING id INTO v_q63;
  INSERT INTO questions (content, weight, topic_id, has_multiple_answers, hint) VALUES
    ('在启发式替代过程中，如果有人问你你这些天对生活满意吗？，你最有可能用哪个更简单的问题来替代作答？', 1, v_topic_id, false, '考虑一下系统1在面对抽象难题时，最容易提取的即时参考量是什么。')
    RETURNING id INTO v_q64;
  INSERT INTO questions (content, weight, topic_id, has_multiple_answers, hint) VALUES
    ('关于大数法则与小数定律，为何美国肾癌发病率最低的县通常出现在人口稀少的乡村地区？', 1, v_topic_id, false, '请回想书中提到的杰克与吉尔从瓮中取球的数学事实，特别是样本量的大小与极端结果概率的关系。')
    RETURNING id INTO v_q65;

  -- 4. Answers
  INSERT INTO answers (content, correct, question_id, rationale) VALUES
    ('系统1的运行是无意识且快速的，处于自主控制状态。', false, v_q56, '这是系统1的核心定义，它在处理日常直觉和印象时表现得极为迅速且无需刻意努力。'),
    ('系统2的主要任务是观察并抑制系统1产生的冲动和直觉。', false, v_q56, '系统2负责自我控制和理性分析，在检测到系统1可能犯错时会介入调控。'),
    ('当人们在进行复杂的数学运算（如 17×24）时，主要依靠系统1运行。', true, v_q56, '复杂的运算需要按部就班的脑力工作和专注力，这是慢思考系统2的典型特征，而非自主运行的系统1。'),
    ('系统1不断为系统2提供印象、直觉、意向和感觉等信息。', false, v_q56, '系统1是信息的原始来源，只有当它遇到阻碍或需要更精密的处理时，才会向系统2寻求支持。'),

    ('大猩猩这类突发刺激属于系统1的自动监测范畴，必然会被察觉。', false, v_q57, '虽然监测环境是系统1的功能，但极度的专注会屏蔽掉不相关的显著刺激。'),
    ('当系统2专注于高难度的认知任务时，会忽视那些显而易见的事物。', true, v_q57, '注意力是有限的资源，当人们全神贯注于计数等任务时，会产生有效的屏蔽，甚至忽视视野中出现的奇异对象。'),
    ('观察者的视觉系统在实验中出现了生理性盲点，导致图像未投射到大脑。', false, v_q57, '这并非生理结构问题，而是认知层面的注意力分配机制导致的屏蔽现象。'),
    ('系统1对动态物体的捕捉能力随着任务难度的增加而同步增强。', false, v_q57, '事实恰恰相反，高难度的任务会占用几乎所有的注意力资源，削弱系统1对环境变动的感知。'),

    ('自我控制完全依靠意志力，不受生理生化物质的影响。', false, v_q58, '研究表明自我控制是一个消耗生理能量的过程，并非纯粹的抽象意识活动。'),
    ('大脑在进行自我控制任务时，血液中的葡萄糖水平会下降。', true, v_q58, '神经系统消耗能量极高，自我控制这种高强度活动会导致血糖储备下降，且补充葡萄糖能缓解这种损耗。'),
    ('只有在进行体力活动时，大脑才会产生自我损耗现象。', false, v_q58, '认知努力、情感抑制和行为控制等所有自主努力的形式都会导致损耗。'),
    ('自我损耗会增强系统2对系统1直觉冲动的监控能力。', false, v_q58, '损耗会导致系统2变得疲劳和懒惰，使人更容易屈从于系统1的直觉、欲望或自私决策。'),

    ('学生在后续测试中对年龄的敏感度显著提高。', false, v_q59, '启动效应通常在潜意识层面运作，学生并未意识到自己对年龄更加敏感。'),
    ('学生的行走速度在不知不觉中变慢了。', true, v_q59, '这被称为概念运动效应，即被启动的老年概念触发了与之相关的慢走行为。'),
    ('学生对佛罗里达州的地理知识产生了强烈的记忆唤醒。', false, v_q59, '佛罗里达州在实验中仅作为与老年概念相关的联想词，而非知识测试的主体。'),
    ('学生表现出对老年人的反感，导致认知紧张。', false, v_q59, '实验观察到的是行为的顺应性，而非情绪的反感，且过程是完全无意识的。'),

    ('使用高质量的纸张和高对比度的字体。', false, v_q60, '清晰的视觉呈现能带来认知放松，增加读者对信息真实性的信任感。'),
    ('尽量使用华丽和复杂的辞藻以显示专业性。', true, v_q60, '研究表明用浮夸的语言表达熟悉概念会降低可信度并显得智商低下，简洁的语言更易被接受。'),
    ('将重要的陈述转化为押韵的格言形式。', false, v_q60, '押韵的表述能提高处理的顺滑感，使其在读者眼中显得更有远见和深刻。'),
    ('引用一些名字朗朗上口、易于发音的信息源。', false, v_q60, '易于发音的名字能减少系统2的计算负担，从而引发信任感。'),

    ('浅灰色字体能激发读者的阅读兴趣和好奇心。', false, v_q61, '认知的困难感通常不会增加兴趣，反而会造成不适。'),
    ('视觉障碍迫使读者的系统1加速运行以识别单词。', false, v_q61, '识别单词的障碍并不能提升逻辑分析能力，系统1本身不具备逻辑纠错功能。'),
    ('认知紧张会调动起系统2，从而抑制系统1的直觉性答案。', true, v_q61, '当阅读变得困难时，系统2会被唤醒以解决当前的不适，它会复核那些本可能被系统1忽悠过去的直觉错误。'),
    ('浅灰色字体减少了光环效应对判断的干扰。', false, v_q61, '字体清晰度主要影响的是认知放松度，而非人际或属性之间的情感联想偏移。'),

    ('人们能意识到证据的缺失，并因此进行更缜密的推理。', false, v_q62, '事实正相反，系统1往往会忽略缺失的信息，只关注眼前的现有证据。'),
    ('系统1擅长提取已知信息构建连贯的故事，而连贯性是自信的来源。', true, v_q62, '自信程度取决于对亲眼所见之事的讲述效果和一致性，而非证据的质量或数量。'),
    ('系统2会对有限的信息进行过度补偿，人为提高其权重。', false, v_q62, '系统2通常是懒惰的，它倾向于直接认可系统1构建的连贯情节，而非去质疑信息的完整性。'),
    ('证据越少，系统1产生的联想涟漪就越弱，从而减少了干扰因素。', false, v_q62, '干扰的减少并不直接导致自信，自信主要来自于故事情节的无歧义和顺畅性。'),

    ('选民能够通过面部特征准确识别出候选人的智商。', false, v_q63, '没有证据表明面部特征能真实预测候选人的行政表现或智力水平。'),
    ('这种现象反映了系统1通过面部特征（如方下巴）进行的基本判断影响了选择。', true, v_q63, '人类进化的遗传机制使我们能快速评估他人的强势和可信度，这种直觉往往会替代复杂的政治分析。'),
    ('政治家在拍照时通常会运用心理学技巧来操控选民的系统2。', false, v_q63, '这种评估往往是在瞬间完成的直觉反应，系统2此时通常处于未被激活的状态。'),
    ('面部特征的可爱程度比能力评估对选举结果的影响更深远。', false, v_q63, '托多罗夫的发现明确指出，对于胜选预测来说，能力评估的预见性远强于可爱程度。'),

    ('我最近两年的职业规划是否顺利？', false, v_q64, '这仍是一个复杂且需要长时记忆检索的问题，不符合启发式简化的原则。'),
    ('我现在的心情如何？', true, v_q64, '当前的情绪状态是系统1最容易获取的即时信息，常被用来替代复杂的宏观生活满意度评价。'),
    ('我的存款是否足以支付下个月的账单？', false, v_q64, '这种具体的经济核算涉及系统2的计算，而非情感性的直觉替代。'),
    ('社会整体的幸福感在近期是否有提升？', false, v_q64, '这涉及外部信息的统计，比个人感受的主观评估更难，不符合替代的方向。'),

    ('乡村地区的空气新鲜、食品无添加，生活方式更健康。', false, v_q65, '这属于系统1寻找因果关系的错觉，无法解释为何发病率最高的县也常在同样的地区。'),
    ('这是由于抽样统计中的小样本更容易产生极端结果。', true, v_q65, '统计学事实表明，小样本的波动性极大，更容易出现极高或极低的统计偏差，这与因果关系无关。'),
    ('乡村地区的医疗登记制度不健全，导致漏报率高。', false, v_q65, '虽然漏报可能存在，但这种地理分布的显著两极化主要源于人口基数差异带来的统计学随机效应。'),
    ('该地区的特定基因库具有更强的肾癌抵抗力。', false, v_q65, '基因因素无法解释为何高发病率同样在人口稀少地区呈现，这本质上是一个统计学陷阱。');

  RAISE NOTICE 'Migrated topic "思考，快与慢" with id=%, 7 assets, 10 questions, 40 answers.', v_topic_id;
END $$;
