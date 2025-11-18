-- Seed data for learning topics
-- Contains two topics: University (大学之路) and Brain Science (考试脑科学)

DO $$
DECLARE
    v_topic_id INTEGER;
    v_question_id INTEGER;
BEGIN
    -- ========================================
    -- Topic 1: 大学之路 (The Path to University)
    -- ========================================
    INSERT INTO topics (name, description, cover_url)
    VALUES ('大学之路',
            '大学之路一书,作者从陪儿女选大学出发,引出什么是大学,为什么要上大学?在这个过程中,作者讲述了大学的历史由来以及如何演化到今天的大学。通过美国名校的特点和发展史,引人思考,大学在推动人类进步的各个方面所扮演的角色。什么是好的大学?什么是人生的大道?什么是我们值得我们努力奋斗并追求的?',
            'cloud://learn-production-1fyzsv3105009f4.6c65-learn-production-1fyzsv3105009f4-1327392464/university/s33314356.jpg')
    RETURNING id INTO v_topic_id;

    -- Question 1
    INSERT INTO questions (topic_id, content, has_multiple_answers)
    VALUES (v_topic_id, '什么是大学? 为什么要上大学?', true)
    RETURNING id INTO v_question_id;

    INSERT INTO answers (question_id, content, correct) VALUES
        (v_question_id, '大学并不是一个简单传授知识的课堂,而是一个传大道的的地方。大学应该有大师,通过大师的指导解惑,做学问,做人。', true),
        (v_question_id, '大学教育的目的是培养服务社会的精英和知识分子,而不是获取名誉或者赚大钱。', true),
        (v_question_id, '大学教育的另一个目的的是获得良知,培养社会责任感,不断的为建设一个公平,文明,进步的社会做贡献。', true),
        (v_question_id, '大学和高中没有什么不同,老师讲课,学生学习知识,为以后找工作打基础', false),
        (v_question_id, '通过不断的研究,发展丰富人类人文,社科,自然知识。', true),
        (v_question_id, '虽然上大学不是为了赚大钱,但对于贫困阶层家庭,却可以通过系统专业的知识学习,为以后工作打下一定的基础。', true),
        (v_question_id, '好多人不上大学照样有''出息'',所有上不上大学,无所谓。', false);

    -- Question 2
    INSERT INTO questions (topic_id, content, has_multiple_answers)
    VALUES (v_topic_id, '什么是好的大学?', true)
    RETURNING id INTO v_question_id;

    INSERT INTO answers (question_id, content, correct) VALUES
        (v_question_id, '它是年轻人的家,是他们度过人生最好时光的地方。', true),
        (v_question_id, '推存学术自由,完善的硬件,雄厚的资金支持科研。', true),
        (v_question_id, '好的大学都有鲜明的特点个性,有自己的办学理念,它希望找到和自己理念想通的学生,双向奔赴。所有的其它活动教学都是围绕理念进行的。一所没有独特理念的大学一定是乏味的。', true),
        (v_question_id, '统一思想,把正确的思想,理念,价值观传递给学生。', false),
        (v_question_id, '从学生的需求的角度出发,为学生的发展考虑,而不是注重徒有其表学校的排名。给每一个学生一个自由发展的空间,而不是给强行灌输自己的"正确理念"。相信未来,相信年轻人。', true),
        (v_question_id, '有一群优秀的同学一起生活学习讨论问题,能和优秀的同学思想自由碰撞。', true),
        (v_question_id, '有卓越的教授指导学生,教扎实的基础知识,不仅能为年轻人指明方向,更能开拓他们的视野。学生们不仅能学到书本的知识,而且还能从教授那里学习治学与为人之道。同时学术研究水平能在某个领域有一席之地。', true),
        (v_question_id, '给学生多讲授知识,多留作用,多讲难题,把学生难倒,讲授的课程不管对学生有没有用,课程有没有过时,只管讲给学生。', false),
        (v_question_id, '对于工科类的大学,能为工业界提供理论或技术支持,或者和工业界一起合作研究开发并在其中担任举足轻重的责任。对于文科类的大学,能引领社会思潮,推动社会的进步。', true);

    -- ========================================
    -- Topic 2: 考试脑科学 (Exam Brain Science)
    -- ========================================
    INSERT INTO topics (name, description, cover_url)
    VALUES (
        '考试脑科学',
        '《考试脑科学》并不是一本充满高深术语或故弄玄虚通过标新立异、与众不同的言论来获得更多的关注的书，它根据目前脑科学研究成果和各种实验，总结出一系列用脑的好习惯和高效学习方法。学生时代我们的学习或许是为了考试，参加工作后，学习并不是单纯为了考试，但怎样科学用脑，在日常生活中理解事物，判断是非，应用所学知识，活出属于自己的多彩人生，是每个人都希望的。',
        'cloud://learn-production-1fyzsv3105009f4.6c65-learn-production-1fyzsv3105009f4-1327392464/brain/brain.jpg'
    )
    RETURNING id INTO v_topic_id;

    -- Question 1
    INSERT INTO questions (topic_id, content)
    VALUES (v_topic_id, '总听到有人说，我上学的时候记性特别差，总记不住知识，不擅长学习考试，这样的说法有道理吗？')
    RETURNING id INTO v_question_id;

    INSERT INTO answers (question_id, content, correct)
    VALUES
        (v_question_id, '总是这样，有些人天生就比别人聪明记忆力好，学习好。', false),
        (v_question_id, '就脑的特性来说，大部分人的记忆和理解能力开始时是差不多的，那些考试成绩好的人除了有高效方法学习和记忆，他们通常有强烈的热情和兴趣去学习。', true);

    -- Question 2
    INSERT INTO questions (topic_id, content)
    VALUES (v_topic_id, '人们常说：这个孩子很聪明，只是不愿意学习。如果他努力学习，一定能学好。但这种说法真的准确吗？')
    RETURNING id INTO v_question_id;

    INSERT INTO answers (question_id, content, correct)
    VALUES
        (v_question_id, '这种说法过于偏颇。"能做到的人"和"做不到的人"之间的差别，不过是源于他们一开始在学习意愿上体现出的细微差别罢了。但这种学习的意愿，却是智商和核心要素。所以不愿意，就是做不到。', true),
        (v_question_id, '这种说法很准确，有的孩子平时参加各项活动都表现的很精明，所以只要他努力学习,就一定能学好。', false);

    -- Question 3
    INSERT INTO questions (topic_id, content)
    VALUES (v_topic_id, '谈恋爱能促进学习吗？')
    RETURNING id INTO v_question_id;

    INSERT INTO answers (question_id, content, correct)
    VALUES
        (v_question_id, '能，谈恋爱的人可以相互督促鼓励，促进学习。', false),
        (v_question_id, '绝大部分例子是：恋爱会分散注意力，让人不再考虑除恋爱对象以外的其他事情，学校里学习的知识也不例外。深陷恋爱中会影响学习工作和生活。', true);

    -- Question 4
    INSERT INTO questions (topic_id, content)
    VALUES (v_topic_id, '常听到这样的说法，学校课程无用，日常生活中只需掌握基本的算术和识字能力。那些微积分、古文，物理化学和哲学等深奥学科在实际工作和生活中毫无用处。你是否赞同这种观点？')
    RETURNING id INTO v_question_id;

    INSERT INTO answers (question_id, content, correct)
    VALUES
        (v_question_id, '学校里学到的知识被认为没有用，可以能是各个方面照成的，第一，例如如常生活中好多时候我们需要用到高等数学的知识，只是我们碰到问题的时候，没有办法把它和当初学到的知识关联起来，即我们没有办法应用知识，同理物理，化学，哲学。第二，当时学习这些科目时候的"方法"，逻辑和思维方法能帮助我们处理日常生活中碰到的难题，识理解判断事物，如果我们没有学会这些思考方法，那就等于没有上学。', true),
        (v_question_id, '确实是这样，当你走向社会的时候，学校里学的大部分课程都没有什么实际作用，会简单认字，加减乘除就足够了。', false);

    -- Question 5
    INSERT INTO questions (topic_id, content)
    VALUES (v_topic_id, '上学时，我们身边经常会遇到一些人，他们平时不学习，考前突击学一下，也能考出好的成绩，这样的学习方法可取吗？')
    RETURNING id INTO v_question_id;

    INSERT INTO answers (question_id, content, correct)
    VALUES
        (v_question_id, '只要自己有这种能力和学习效率，这种方法完全可以效仿。这是学习效率高的体现，有些人就是悟性高，每次只要考前突击一下，就能取得和每天都认真学习的人一样的分数。', false),
        (v_question_id, '虽然短期看起来使用两种学习方法取得的成绩相同，但如果从培养长远的学习实力的角度来看，还是坚持每天勤勉学习的分散学习法更有利。没有循序渐进地学习，考试过后，所学知识很快就会被遗忘。更不用说日后能够应用这些知识来解决实际问题了。', true);

    -- Question 6
    INSERT INTO questions (topic_id, content)
    VALUES (v_topic_id, '总有人问，我现在已经参加工作，没有必要考试，还需要关注考试脑科学吗？')
    RETURNING id INTO v_question_id;

    INSERT INTO answers (question_id, content, correct)
    VALUES
        (v_question_id, '考试无处不在，领导问你一个问题，生活中遇到一个问题，等等，这些都是无形的考试。怎样高效的学习，理解，应用，判断无处不在。', true),
        (v_question_id, '没有必要，几乎没有考试。', false);
END $$;
