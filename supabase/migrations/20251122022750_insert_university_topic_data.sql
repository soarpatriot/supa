-- Insert university topic with questions and answers
DO $$
DECLARE
    v_topic_id INTEGER;
    v_question_id INTEGER;
BEGIN
    -- Insert into topics table
    INSERT INTO topics (name, description, cover_url, current_fee, original_fee)
    VALUES ('大学之路',
            '大学之路一书,作者从陪儿女选大学出发,引出什么是大学,为什么要上大学?在这个过程中,作者讲述了大学的历史由来以及如何演化到今天的大学。通过美国名校的特点和发展史,引人思考,大学在推动人类进步的各个方面所扮演的角色。什么是好的大学?什么是人生的大道?什么是我们值得我们努力奋斗并追求的?',
            'cloud://learn-production-1fyzsv3105009f4.6c65-learn-production-1fyzsv3105009f4-1327392464/university/s33314356.jpg'
            ,199,999)
    RETURNING id INTO v_topic_id;

    -- Insert first question
    INSERT INTO questions (topic_id, content, has_multiple_answers)
    VALUES (v_topic_id, '什么是大学? 为什么要上大学?', true)
    RETURNING id INTO v_question_id;

    -- Insert answers for first question
    INSERT INTO answers (question_id, content, correct) VALUES
        (v_question_id, '大学并不是一个简单传授知识的课堂,而是一个传大道的的地方。大学应该有大师,通过大师的指导解惑,做学问,做人。', true),
        (v_question_id, '大学教育的目的是培养服务社会的精英和知识分子,而不是获取名誉或者赚大钱。', true),
        (v_question_id, '大学教育的另一个目的的是获得良知,培养社会责任感,不断的为建设一个公平,文明,进步的社会做贡献。', true),
        (v_question_id, '大学和高中没有什么不同,老师讲课,学生学习知识,为以后找工作打基础', false),
        (v_question_id, '通过不断的研究,发展丰富人类人文,社科,自然知识。', true),
        (v_question_id, '虽然上大学不是为了赚大钱,但对于贫困阶层家庭,却可以通过系统专业的知识学习,为以后工作打下一定的基础。', true),
        (v_question_id, '好多人不上大学照样有''出息'',所有上不上大学,无所谓。', false);

    -- Insert second question
    INSERT INTO questions (topic_id, content, has_multiple_answers)
    VALUES (v_topic_id, '什么是好的大学?', true)
    RETURNING id INTO v_question_id;

    -- Insert answers for second question
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
END $$;
