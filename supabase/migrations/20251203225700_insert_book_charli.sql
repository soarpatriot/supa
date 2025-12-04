-- Migration: insert_book_charli
-- Created: 2025-12-03
-- Description: Insert book data for Charli

-- Add your SQL content here

-- Insert statements for 穷查理宝典 (Poor Charlie's Almanack)
-- Generated from charli-finnal.json
-- Note: Uses sequences to avoid ID conflicts with existing data

-- Insert category (will skip if already exists)
INSERT INTO categories (name) 
VALUES ('商业')
ON CONFLICT DO NOTHING;

-- Insert topic
WITH category_lookup AS (
  SELECT id FROM categories WHERE name = '商业' LIMIT 1
)
INSERT INTO topics (
  name, 
  description, 
  explaination, 
  cover_url, 
  current_fee, 
  original_fee, 
  author, 
  category_id, 
  created_at, 
  updated_at
)
SELECT
  '穷查理宝典',
  '查理·芒格是沃伦·巴菲特的长期合作伙伴和伯克希尔·哈撒韦公司的副董事长。他以其深邃的思考方式和独特的投资哲学而闻名。芒格的智慧不仅体现在投资领域，还包括对人生、心理学和哲学的深入理解。他提倡多元思维模型，强调跨学科的知识整合，并且对常见的心理偏见有着深刻的洞察。芒格的演讲和著作中充满了智慧的箴言和实用的投资原则，影响了无数投资者和商界领袖。',
  NULL,
  'cloud://learn-production-1fyzsv3105009f4.6c65-learn-production-1fyzsv3105009f4-1327392464/charlie/cover.jpg',
  199,
  999,
  '查理·芒格',
  category_lookup.id,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM category_lookup;

-- Insert asset (AI multiple people audio)
WITH topic_lookup AS (
  SELECT id FROM topics WHERE name = '穷查理宝典' ORDER BY id DESC LIMIT 1
)
INSERT INTO assets (
  type,
  link,
  topic_id,
  created_at,
  updated_at
)
SELECT
  3,
  'cloud://learn-production-1fyzsv3105009f4.6c65-learn-production-1fyzsv3105009f4-1327392464/charlie/charli.m4a',
  topic_lookup.id,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM topic_lookup;

-- Insert questions and answers
-- All questions and answers will use auto-generated IDs from sequences

-- Question 1
WITH topic_lookup AS (
  SELECT id FROM topics WHERE name = '穷查理宝典' ORDER BY id DESC LIMIT 1
),
new_question AS (
  INSERT INTO questions (content, weight, topic_id, has_multiple_answers, hint, created_at, updated_at)
  SELECT '根据李录在《中文版序言》中的描述，查理·芒格思考问题的一个显著特点是什么？', NULL, topic_lookup.id, false, '想一想那位农夫的谚语："我只想知道将来我会死在什么地方，这样我就不去那儿了。"', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  FROM topic_lookup
  RETURNING id
)
INSERT INTO answers (content, correct, question_id, rationale, created_at, updated_at)
SELECT * FROM (VALUES
  ('总是从逆向开始，先研究如何失败或变得痛苦。', true, (SELECT id FROM new_question), '序言中提到，芒格研究人生如何得到幸福时，首先研究人生如何才能变得痛苦，这种逆向思维是他独特的思考方法。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('依赖计算机模型和数据分析来做出决策。', false, (SELECT id FROM new_question), '文中强调芒格依赖的是普世智慧和多元思维模型，而非单纯的数据或计算机模型。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('优先考虑短期收益，并根据市场波动进行调整。', false, (SELECT id FROM new_question), '这与芒格和巴菲特的长期投资理念完全相反，他们强调耐心和长远眼光。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('遵循主流经济学理论和商学院的教导。', false, (SELECT id FROM new_question), '芒格对学院派经济学和商学院的许多理论都持批评态度，认为它们过于狭隘。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
) AS v(content, correct, question_id, rationale, created_at, updated_at);

-- Question 2
WITH topic_lookup AS (
  SELECT id FROM topics WHERE name = '穷查理宝典' ORDER BY id DESC LIMIT 1
),
new_question AS (
  INSERT INTO questions (content, weight, topic_id, has_multiple_answers, hint, created_at, updated_at)
  SELECT '沃伦·巴菲特认为查理·芒格对他最大的影响是什么？', NULL, topic_lookup.id, false, '思考一下从格拉汉姆的"价值投资"到伯克希尔后期风格的转变。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  FROM topic_lookup
  RETURNING id
)
INSERT INTO answers (content, correct, question_id, rationale, created_at, updated_at)
SELECT * FROM (VALUES
  ('教他如何只购买价格远低于清算价值的"烟屁股"公司。', false, (SELECT id FROM new_question), '这是本杰明·格拉汉姆的教导，而芒格的影响是让巴菲特超越了这种方法。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('让他认识到购买价格公道的伟大企业比购买价格超低的普通企业更好。', true, (SELECT id FROM new_question), '巴菲特多次明确表示，是查理让他摆脱了格拉汉姆的局限，开始关注企业的质量和"护城河"。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('说服他将投资范围扩大到国际市场和高科技领域。', false, (SELECT id FROM new_question), '事实上，芒格和巴菲特都对投资他们不了解的高科技领域持谨慎态度。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('向他传授了通过卖空股票来对冲风险的技巧。', false, (SELECT id FROM new_question), '芒格对卖空股票持负面看法，认为这是一件苦恼的事情，不值得去做。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
) AS v(content, correct, question_id, rationale, created_at, updated_at);

-- Question 3
WITH topic_lookup AS (
  SELECT id FROM topics WHERE name = '穷查理宝典' ORDER BY id DESC LIMIT 1
),
new_question AS (
  INSERT INTO questions (content, weight, topic_id, has_multiple_answers, hint, created_at, updated_at)
  SELECT '根据芒格的观点，为什么会计报表只能作为分析企业的起点，而不是终点？', NULL, topic_lookup.id, false, '想想卡尔·布劳恩对他公司标准会计报表的评价："这是狗屁"。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  FROM topic_lookup
  RETURNING id
)
INSERT INTO answers (content, correct, question_id, rationale, created_at, updated_at)
SELECT * FROM (VALUES
  ('因为会计准则过于复杂，只有专业会计师才能完全理解。', false, (SELECT id FROM new_question), '芒格认为会计本身不难理解，关键在于要认识到它的局限性。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('因为会计只是一种粗略的估算，并且忽略了许多无形资产和管理质量等关键因素。', true, (SELECT id FROM new_question), '芒格强调，要超越会计数字，评估企业的"护城河"、管理层的可靠性等无法量化的因素。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('因为上市公司发布的会计报表通常会为了股价而进行粉饰。', false, (SELECT id FROM new_question), '虽然芒格警惕会计欺诈，但他认为会计的根本局限性在于其估算本质，即使在报表真实的情况下也存在。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('因为历史的会计数据对预测未来几乎没有价值。', false, (SELECT id FROM new_question), '芒格会利用历史数据，但会对其进行调整并结合其他因素，而不是完全否定其价值。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
) AS v(content, correct, question_id, rationale, created_at, updated_at);

-- Question 4
WITH topic_lookup AS (
  SELECT id FROM topics WHERE name = '穷查理宝典' ORDER BY id DESC LIMIT 1
),
new_question AS (
  INSERT INTO questions (content, weight, topic_id, has_multiple_answers, hint, created_at, updated_at)
  SELECT '芒格为什么对"EBITDA（未计利息、税项、折旧及摊销前的利润）"这个财务指标持强烈的批评态度？', NULL, topic_lookup.id, false, '想想看，一家工厂的机器设备会损耗，这笔费用是真实的开销吗？', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  FROM topic_lookup
  RETURNING id
)
INSERT INTO answers (content, correct, question_id, rationale, created_at, updated_at)
SELECT * FROM (VALUES
  ('因为它没有充分反映公司的增长潜力。', false, (SELECT id FROM new_question), '芒格的批评点在于该指标掩盖了真实的成本，而不是增长潜力。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('因为它忽略了资本支出这一真实的成本，会误导投资者对公司盈利能力的判断。', true, (SELECT id FROM new_question), '芒格认为折旧和摊销是真实的成本，忽略它们就等于在说谎，他建议用"狗屁利润"来代替这个词。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('因为它计算过程复杂，容易出现会计错误。', false, (SELECT id FROM new_question), '他的批评是基于概念上的误导性，而非计算的复杂性。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('因为它只适用于科技公司，不适用于传统行业。', false, (SELECT id FROM new_question), '他对该指标的批评是普遍性的，认为它对所有需要资本支出的企业都具有误导性。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
) AS v(content, correct, question_id, rationale, created_at, updated_at);

-- Question 5
WITH topic_lookup AS (
  SELECT id FROM topics WHERE name = '穷查理宝典' ORDER BY id DESC LIMIT 1
),
new_question AS (
  INSERT INTO questions (content, weight, topic_id, has_multiple_answers, hint, created_at, updated_at)
  SELECT '查理·芒格认为，像可口可乐这样的伟大企业，其成功的关键因素之一是什么？', NULL, topic_lookup.id, false, '回忆一下巴甫洛夫的狗和铃铛的经典实验。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  FROM topic_lookup
  RETURNING id
)
INSERT INTO answers (content, correct, question_id, rationale, created_at, updated_at)
SELECT * FROM (VALUES
  ('通过不断降价来抢占市场份额。', false, (SELECT id FROM new_question), '芒格反而指出了可口可乐拥有"尚未利用的提价能力"，这是其优势之一。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('利用复杂的专利技术来阻止竞争。', false, (SELECT id FROM new_question), '可口可乐的成功更多是基于品牌、分销和消费者心理，而非难以复制的专利技术。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('通过巴甫洛夫联想等心理学原理，将产品与愉快的情感和体验联系起来。', true, (SELECT id FROM new_question), '芒格在演讲中详细分析了可口可乐如何利用多种心理学效应，让消费者在潜意识中形成积极的品牌联想。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('完全依赖广告投入，而不注重产品本身的味道。', false, (SELECT id FROM new_question), '芒格在分析中也提到了味道的重要性，这是消费者体验的基础。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
) AS v(content, correct, question_id, rationale, created_at, updated_at);

-- Question 6
WITH topic_lookup AS (
  SELECT id FROM topics WHERE name = '穷查理宝典' ORDER BY id DESC LIMIT 1
),
new_question AS (
  INSERT INTO questions (content, weight, topic_id, has_multiple_answers, hint, created_at, updated_at)
  SELECT '在《在哈佛学校毕业典礼上的演讲》中，芒格提出的保证人生痛苦的"药方"不包括以下哪一项？', NULL, topic_lookup.id, false, '芒格的建议中，有一项是关于个人品格可靠性的。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  FROM topic_lookup
  RETURNING id
)
INSERT INTO answers (content, correct, question_id, rationale, created_at, updated_at)
SELECT * FROM (VALUES
  ('怨恨', false, (SELECT id FROM new_question), '芒格引用了约翰尼·卡森的观点，并补充说怨恨是保证痛苦生活的灵丹妙药。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('妒忌', false, (SELECT id FROM new_question), '妒忌是卡森提到的保证痛苦生活的三种方法之一，芒格对此表示赞同。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('过度储蓄和节俭', true, (SELECT id FROM new_question), '芒格本人和他的偶像本杰明·富兰克林都推崇节俭，他并未将此列为导致痛苦生活的原因。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('反复无常，不虔诚地做事', false, (SELECT id FROM new_question), '这是芒格自己增加的四味药之一，他认为不做到为人可靠会抵消所有优点。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
) AS v(content, correct, question_id, rationale, created_at, updated_at);

-- Question 7
WITH topic_lookup AS (
  SELECT id FROM topics WHERE name = '穷查理宝典' ORDER BY id DESC LIMIT 1
),
new_question AS (
  INSERT INTO questions (content, weight, topic_id, has_multiple_answers, hint, created_at, updated_at)
  SELECT '芒格提倡的"多元思维模型"的核心思想是什么？', NULL, topic_lookup.id, false, '芒格经常引用一句谚语来批评那些只使用单一思维模型的人："在手里拿着铁锤的人看来，每个问题都像钉子。"', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  FROM topic_lookup
  RETURNING id
)
INSERT INTO answers (content, correct, question_id, rationale, created_at, updated_at)
SELECT * FROM (VALUES
  ('精通某一特定学科，如经济学，并用其解决所有问题。', false, (SELECT id FROM new_question), '这正是芒格所批判的"手里拿着铁锤的人"的思维方式，他认为这种方法是灾难性的。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('在头脑里形成一个由来自不同重要学科的关键模型组成的框架，并综合运用它们。', true, (SELECT id FROM new_question), '芒格强调，必须掌握不同学科的重要理论，并将它们联系起来，形成一个融会贯通的思维框架，才能真正理解现实。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('完全抛弃学术理论，只依赖于从商业实践中获得的直接经验。', false, (SELECT id FROM new_question), '芒格非常重视学术理论，尤其是来自硬科学、心理学等学科的模型，他认为最好的学术观念非常有用。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('通过记忆大量孤立的事实来积累知识，以便在需要时提取。', false, (SELECT id FROM new_question), '芒格明确指出，如果只是记忆孤立的事物而不把它们联系在理论框架中，就无法真正理解任何东西。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
) AS v(content, correct, question_id, rationale, created_at, updated_at);

-- Question 8
WITH topic_lookup AS (
  SELECT id FROM topics WHERE name = '穷查理宝典' ORDER BY id DESC LIMIT 1
),
new_question AS (
  INSERT INTO questions (content, weight, topic_id, has_multiple_answers, hint, created_at, updated_at)
  SELECT '芒格所说的"lollapalooza效应"指的是什么？', NULL, topic_lookup.id, false, '这个效应的关键不在于单个因素的力量，而在于多个因素结合时产生的"化学反应"。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  FROM topic_lookup
  RETURNING id
)
INSERT INTO answers (content, correct, question_id, rationale, created_at, updated_at)
SELECT * FROM (VALUES
  ('公司通过巨大的规模优势，彻底击败所有竞争对手。', false, (SELECT id FROM new_question), '规模优势是单一因素，而"lollapalooza效应"强调的是多种因素的共同作用。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('由于单一心理偏见，导致投资者做出极端的非理性决策。', false, (SELECT id FROM new_question), '这个效应的关键在于"合力"，而非单一因素，即使那个因素很强大。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('几种心理倾向或其他因素在同一个方向上共同发挥作用，从而产生极其强大、甚至是极端的后果。', true, (SELECT id FROM new_question), '芒格用这个词来形容多种力量相互强化、产生的合力远超各部分之和的现象，类似于物理学中的"临界质量"。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('在经济繁荣期，几乎所有股票价格都出现非理性上涨的现象。', false, (SELECT id FROM new_question), '这可能是"lollapalooza效应"的一种表现，但不是对该效应本身的定义。该效应描述的是导致结果的"原因机制"。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
) AS v(content, correct, question_id, rationale, created_at, updated_at);

-- Question 9
WITH topic_lookup AS (
  SELECT id FROM topics WHERE name = '穷查理宝典' ORDER BY id DESC LIMIT 1
),
new_question AS (
  INSERT INTO questions (content, weight, topic_id, has_multiple_answers, hint, created_at, updated_at)
  SELECT '在第三讲中，芒格引用了诺姆·乔姆斯基的例子来说明什么问题对人类认知的扭曲作用最大？', NULL, topic_lookup.id, false, '芒格认为，即使是乔姆斯基这样的天才，也会因为一种强大的信念体系而无法客观看待与该信念相悖的科学证据。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  FROM topic_lookup
  RETURNING id
)
INSERT INTO answers (content, correct, question_id, rationale, created_at, updated_at)
SELECT * FROM (VALUES
  ('激励机制引起的偏见。', false, (SELECT id FROM new_question), '虽然芒格经常讨论激励机制的偏见，但在乔姆斯基的例子中，他认为另一种力量起到了更关键的作用。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('专业知识的局限性。', false, (SELECT id FROM new_question), '乔姆斯基是语言学天才，他的错误并非源于缺乏专业知识，而是源于另一种更强大的影响。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('强烈的意识形态。', true, (SELECT id FROM new_question), '芒格认为，乔姆斯基因为其强烈的左翼平等主义意识形态，而无法接受语言能力主要由基因决定的达尔文理论，这严重扭曲了他的认知。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('简单的心理否认。', false, (SELECT id FROM new_question), '心理否认通常与个人不愿接受的痛苦现实有关，而乔姆斯基的例子被芒格用来说明一种更广泛的、系统性的思想偏见。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
) AS v(content, correct, question_id, rationale, created_at, updated_at);

-- Question 10
WITH topic_lookup AS (
  SELECT id FROM topics WHERE name = '穷查理宝典' ORDER BY id DESC LIMIT 1
),
new_question AS (
  INSERT INTO questions (content, weight, topic_id, has_multiple_answers, hint, created_at, updated_at)
  SELECT '芒格将股票市场比作什么系统，来说明为何打败市场平均收益是困难的？', NULL, topic_lookup.id, false, '这个比喻涉及到一个根据公众下注情况不断变化的赔率系统。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  FROM topic_lookup
  RETURNING id
)
INSERT INTO answers (content, correct, question_id, rationale, created_at, updated_at)
SELECT * FROM (VALUES
  ('一个生态系统，强者生存，弱者淘汰。', false, (SELECT id FROM new_question), '他用生态系统来比喻自由市场经济，解释专业化的优势，但用另一个比喻来说明打败市场的难度。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('一场国际象棋比赛，需要深远的策略和计算能力。', false, (SELECT id FROM new_question), '虽然投资需要策略，但他用来说明市场效率和价格机制的比喻是另一个领域。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('赛马中的彩池投注系统，其中赔率已经反映了马匹的公开信息。', true, (SELECT id FROM new_question), '芒格认为，就像赛马一样，股市中好的公司（好马）价格更高（赔率更低），使得找出"定错价格的赌注"非常困难。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('一个由"市场先生"主导的躁狂抑郁市场。', false, (SELECT id FROM new_question), '"市场先生"是格拉汉姆的比喻，用来说明市场情绪的波动性，而芒格用彩池投注系统来解释市场的"部分有效性"。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
) AS v(content, correct, question_id, rationale, created_at, updated_at);

-- Question 11
WITH topic_lookup AS (
  SELECT id FROM topics WHERE name = '穷查理宝典' ORDER BY id DESC LIMIT 1
),
new_question AS (
  INSERT INTO questions (content, weight, topic_id, has_multiple_answers, hint, created_at, updated_at)
  SELECT '芒格用"癌症手术法"来形容哪种商业策略？', NULL, topic_lookup.id, false, '这个比喻强调的是"切除"坏的部分以"拯救"好的部分。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  FROM topic_lookup
  RETURNING id
)
INSERT INTO answers (content, correct, question_id, rationale, created_at, updated_at)
SELECT * FROM (VALUES
  ('在公司出现问题时，迅速解雇所有表现不佳的管理人员。', false, (SELECT id FROM new_question), '这可能是策略的一部分，但"癌症手术法"的核心是针对业务本身，而非仅仅是人事。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('识别出公司内部混乱业务中仍然健康的"核心"业务，然后砍掉所有其他业务来拯救它。', true, (SELECT id FROM new_question), '这个比喻形象地描述了果断切除不良业务，以保留和拯救公司优质资产的策略，芒格以政府职员保险公司（GEICO）的扭亏为盈为例。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('对公司进行激进的成本削减，以提高短期利润率。', false, (SELECT id FROM new_question), '这个方法更侧重于保留和剥离，而非全面的成本削减，其目的是为了长期的健康，而不是短期利润。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('收购濒临破产的公司，并利用其税收亏损来避税。', false, (SELECT id FROM new_question), '芒格明确表示不喜欢为了避税而做出的商业决策，这个方法的核心是拯救有价值的业务本身。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
) AS v(content, correct, question_id, rationale, created_at, updated_at);

-- Question 12
WITH topic_lookup AS (
  SELECT id FROM topics WHERE name = '穷查理宝典' ORDER BY id DESC LIMIT 1
),
new_question AS (
  INSERT INTO questions (content, weight, topic_id, has_multiple_answers, hint, created_at, updated_at)
  SELECT '查理·芒格认为，要定义自己的"能力圈"，最关键的标准是什么？', NULL, topic_lookup.id, false, '这个标准要求你成为自己最严厉的批评者，甚至要超越外部最强的反对者。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  FROM topic_lookup
  RETURNING id
)
INSERT INTO answers (content, correct, question_id, rationale, created_at, updated_at)
SELECT * FROM (VALUES
  ('拥有相关领域的博士学位和多年的从业经验。', false, (SELECT id FROM new_question), '虽然学历和经验有帮助，但芒格强调的是一种更为严格的自我检验标准。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('能够比全世界最聪明、最有能力反驳这个观点的人更能够证否自己。', true, (SELECT id FROM new_question), '这体现了芒格对知识诚实和客观性的极致要求，也是他定义能力圈的核心标准。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('在这个领域内的投资从未出现过亏损。', false, (SELECT id FROM new_question), '芒格承认错误是不可避免的，能力圈的意义在于提高决策质量，而非保证永不犯错。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('能够向一个外行清晰地解释这个领域的复杂概念。', false, (SELECT id FROM new_question), '这是一种检验理解深度的方法，但芒格提出的标准更侧重于对抗自己的偏见和错误。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
) AS v(content, correct, question_id, rationale, created_at, updated_at);

-- Question 13
WITH topic_lookup AS (
  SELECT id FROM topics WHERE name = '穷查理宝典' ORDER BY id DESC LIMIT 1
),
new_question AS (
  INSERT INTO questions (content, weight, topic_id, has_multiple_answers, hint, created_at, updated_at)
  SELECT '根据芒格的投资原则检查清单，关于"耐心"这一项，其核心思想是什么？', NULL, topic_lookup.id, false, '爱因斯坦称之为"世界第八大奇迹"的概念是这项原则的核心。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  FROM topic_lookup
  RETURNING id
)
INSERT INTO answers (content, correct, question_id, rationale, created_at, updated_at)
SELECT * FROM (VALUES
  ('积极进行交易，通过频繁买卖来抓住市场每一个微小的波动。', false, (SELECT id FROM new_question), '这与芒格的"坐等投资法"完全相反，他主张避免多余的交易和摩擦成本。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('克制人类天生爱行动的偏好，认识到复利的魔力，非必要不去打断它。', true, (SELECT id FROM new_question), '芒格认为，耐心等待极好的机会，并长期持有以让复利发挥作用，是投资成功的关键。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('定期将投资组合重新平衡，以确保资产配置符合预设的比例。', false, (SELECT id FROM new_question), '这种机械的再平衡与芒格的"集中投资于少数好机会"的理念有所出入。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('将资金分散投资于多种资产类别，耐心等待整个市场的长期增长。', false, (SELECT id FROM new_question), '芒格对过度分散持批评态度，他的"耐心"是等待少数可以下重注的机会，而非被动等待市场平均回报。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
) AS v(content, correct, question_id, rationale, created_at, updated_at);
