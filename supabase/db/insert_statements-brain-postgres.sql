-- Insert into topics table and get the ID using RETURNING
DO $$
DECLARE
    v_topic_id INTEGER;
    v_question_id INTEGER;
BEGIN
    -- Insert topic
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
