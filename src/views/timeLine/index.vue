<template>
  <div class="suoming-page">
    <!-- ===== 背景层 ===== -->
    <div class="bg-layer" aria-hidden="true">
      <span class="bg-ink bg-ink--1"></span>
      <span class="bg-ink bg-ink--2"></span>
      <span class="bg-ink bg-ink--3"></span>
      <span class="bg-ink bg-ink--4"></span>

      <div class="bg-chains">
        <span
          v-for="(c, i) in chainsBg"
          :key="i"
          class="chain-thread"
          :class="`chain-thread--${c.hue}`"
          :style="{
            left: c.left + '%',
            animationDuration: c.dur + 's',
            animationDelay: c.delay + 's',
            opacity: c.opacity,
          }"
        ></span>
      </div>

      <span class="bg-grain"></span>
      <span class="bg-vignette"></span>
    </div>

    <!-- ===== 章节导航：长页面里给一盏沿路的路灯 ===== -->
    <nav class="chapter-nav" aria-label="章节导航">
      <button
        v-for="c in chapters"
        :key="c.id"
        type="button"
        class="chapter-nav__item"
        :class="{ 'is-active': activeChapter === c.id }"
        :aria-current="activeChapter === c.id ? 'true' : undefined"
        @click="scrollToChapter(c.id)"
      >
        <span class="chapter-nav__num">{{ c.num }}</span>
        <span class="chapter-nav__label">{{ c.label }}</span>
        <i class="chapter-nav__dot" aria-hidden="true"></i>
      </button>
    </nav>

    <main class="container">
      <!-- ===================== HERO ===================== -->
      <header class="hero" id="intro">
        <div class="hero__portrait">
          <div class="portrait-frame">
            <span class="frame-corner tl"></span>
            <span class="frame-corner tr"></span>
            <span class="frame-corner bl"></span>
            <span class="frame-corner br"></span>
            <span class="frame-scan"></span>
            <img
              src="@/assets/images1/1.webp"
              alt="锁暝"
              class="portrait-img"
              loading="lazy"
            />
          </div>
          <div class="portrait-badge">
            <span class="badge-seal">契</span>
            <span class="badge-text">十重契 · 禁锁契主</span>
          </div>

          <p class="hero-note sm-note">
            所有人，感受御姐！
            <span class="hero-note__sign">—— 霜落天亦</span>
          </p>
        </div>

        <div class="hero__meta">
          <span class="meta-vertical" aria-hidden="true">锁尽妄执</span>
          <p class="meta-eyebrow">
            <span class="eyebrow-dot"></span>
            禁锁十契 · 契主 / 梦州·谛天鉴州监
          </p>
          <h1 class="meta-name">
            <span class="name-cn">锁暝</span>
            <span class="name-en">SUOMING</span>
          </h1>
          <div class="meta-rule">
            <span class="rule-line"></span>
            <span class="rule-lock"></span>
            <span class="rule-line"></span>
          </div>
          <p class="meta-intro">
            梦州华亭人。为解故乡「恶瘴」之厄，身为契主，创立禁锁十契；后奉「岁主」之命，任职州监，执掌谛天鉴，护佑梦州。
          </p>
          <p class="meta-lead">
            她曾是被华亭城门关在「恶瘴」雨幕中的弃民，却以一把机关伞为众人撑起了归途。十契尽散，独锁九道频率走过两百年——
            <em class="lead-quote">“伞便是最好。”</em>
          </p>
          <div class="meta-cv">
            <span class="cv-label">CV</span>
            <div class="cv-list">
              <span>中 · 葛子瑞</span>
              <span>日 · 大久保瑠美</span>
              <span>英 · Miracle Chance</span>
              <span>韩 · Son Jeong Min</span>
            </div>
          </div>
        </div>
      </header>

      <!-- ===================== 剧情纪事 ===================== -->
      <section class="panel lore-panel" id="lore" v-reveal>
        <div class="panel-head">
          <div class="head-title">
            <h2>剧情纪事</h2>
            <span class="head-sub">STORY CHRONICLE · 3.7</span>
          </div>
          <span class="head-seal">契阔</span>
        </div>

        <p class="panel-intro">
          潮汐任务第四章第四幕「梦枢心相由心生」中，锁暝以谛天鉴梦州州监的身份，与漂泊者一同进入万相神宫内部的「梦枢天罗」，追寻失踪的岁主心月狐，并直面玄方城崩毁危机的真相。
        </p>

        <div class="lore-timeline">
          <!-- 01 -->
          <div class="lore-card">
            <div class="lore-card-num">01</div>
            <div class="lore-card-content">
              <div class="lore-card-head">
                <span class="lore-era">潜入 · 梦枢天罗</span>
                <span class="lore-tag">行动</span>
              </div>
              <h3 class="lore-title">与漂泊者一同进入神宫</h3>
              <p class="lore-para">
                玄方城内流传着“城将崩毁”的传言，而岁主心月狐久未现身。锁暝以谛天鉴梦州州监的身份找到漂泊者，二人一同进入万相神宫内部的「梦枢天罗」——一座由记忆、梦境和心相构成的空间，也是玄方城两百年痕迹的存放之处。
              </p>
              <p class="lore-para">
                进入梦枢天罗后，天人们陷入数据混乱，远处浮现心月狐的巨影。锁暝与漂泊者尚未站稳，天边便伸出一只巨手，将锁暝当场抓走。漂泊者的心域探索，从这一刻起，也成了寻找锁暝的旅程。
              </p>
              <div class="lore-quote">
                <span class="quote-mark">「</span>锁暝州监，祝您心驭万全。<span
                  class="quote-mark"
                  >」</span
                >
              </div>
            </div>
          </div>

          <!-- 02 -->
          <div class="lore-card">
            <div class="lore-card-num">02</div>
            <div class="lore-card-content">
              <div class="lore-card-head">
                <span class="lore-era">孤身 · 溯心之手</span>
                <span class="lore-tag">试炼</span>
              </div>
              <h3 class="lore-title">被天演溯心捕获</h3>
              <p class="lore-para">
                抓走锁暝的，是梦枢天罗中生成的矫正程序——<strong>天演溯心</strong>。它的使命是纠正心偏离岁主底层逻辑的行为，而锁暝作为谛天鉴州监、心月狐频率的持有者，成了溯心必须“处理”的对象。
              </p>
              <p class="lore-para">
                溯心没有直接摧毁她，而是做了一个更残忍的举动：它将锁暝已故的九契重新“捏”了出来，放在她面前。那个一口一个“锁暝姐姐”叫着、什么都不怕的少女，以数据幻象的形式再次站在了她面前。
              </p>
              <div class="lore-trial">
                <span class="trial-label">溯心的试炼</span>
                <p class="trial-text">
                  用锁暝最放不下的人，动摇她与心、与心月狐之间的联结。
                </p>
              </div>
            </div>
          </div>

          <!-- 03 -->
          <div class="lore-card is-key">
            <div class="lore-card-num">03</div>
            <div class="lore-card-content">
              <div class="lore-card-head">
                <span class="lore-era">锁中 · 九契幻象</span>
                <span class="lore-tag lore-tag--key">核心</span>
              </div>
              <h3 class="lore-title">在幻境中守住“锁”的意义</h3>
              <p class="lore-para">
                九契的频率本就封存在玄朱锁中。溯心利用这份频率制造出的“九契”，是锁暝两百年孤守中最柔软的部分，也是最容易被攻破的部分。溯心赌的是，锁暝会为了留住这个幻象，放弃对心的支持，放弃心月狐的嘱托。
              </p>
              <p class="lore-para">
                但她没有。锁暝比任何人都清楚，锁中频率之所以珍贵，恰恰是因为它们已经逝去，而<strong>活着的人、还在等一个答案的人，才需要她继续走下去</strong>。她从幻境中脱身，重新与漂泊者、心会合。
              </p>
            </div>
          </div>

          <!-- 04 -->
          <div class="lore-card is-key">
            <div class="lore-card-num">04</div>
            <div class="lore-card-content">
              <div class="lore-card-head">
                <span class="lore-era">抉择 · 终局战场</span>
                <span class="lore-tag lore-tag--key">转折</span>
              </div>
              <h3 class="lore-title">两次释放：救下心，交还遗言</h3>
              <p class="lore-para">
                决战开始，溯心一把抓住心，准备将她“顷刻炼化”。就在这一刻，锁暝释放了锁中的一道频率——那是她昔日手下的频率，用来挡下溯心对心的致命一击。
              </p>
              <p class="lore-para">
                随后，锁暝释放了<strong>心月狐的最后一缕频率</strong>。心月狐的声音在终局战场上响起：她肯定了心在过去两百年里带领玄方人民打赢云渊之役、守护百姓的作为，认定心是合格的岁主，并将所有力量继承给了心。
              </p>
              <p class="lore-para">
                锁暝在3.7中所做的，正是她百年前对心月狐许下的那个承诺——
                <span class="lore-quote-inline"
                  >“你最后的嘱托，我已明了，我会将它送到「心」手中。”</span
                >
                这句话在终局战场上兑现了。
              </p>
            </div>
          </div>

          <!-- 05 -->
          <div class="lore-card">
            <div class="lore-card-num">05</div>
            <div class="lore-card-content">
              <div class="lore-card-head">
                <span class="lore-era">回响 · 朝月会之后</span>
                <span class="lore-tag">终局</span>
              </div>
              <h3 class="lore-title">两百年孤守之后，第一次与人同行</h3>
              <p class="lore-para">
                溯心被击败，并与心和好，转而协助治理梦枢天罗。玄方城的众人参加了朝月会，心与锁暝也在穗穗的帮助下，准备与仇远、吟霖、景燃一同返回梦州。
              </p>
              <p class="lore-para">
                锁暝走了两百年的路，在3.7的终局里第一次不再是一个人的路。她仍然带着玄朱锁，仍然记得九契，仍然会在束发时把锁放在案旁——但这一次，她身边有了可以一起走下去的人。
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- ===================== 核心机制 ===================== -->
      <section class="panel mechanics-panel" id="mechanics" v-reveal>
        <div class="panel-head">
          <div class="head-title">
            <h2>核心机制</h2>
            <span class="head-sub">CORE MECHANICS</span>
          </div>
          <span class="head-seal">十重契</span>
        </div>

        <div class="skill-list">
          <article class="skill-item">
            <div class="skill-visual">
              <img
                src="./img/skill1.png"
                alt="念起 · 拢伞形·锁妄念"
                loading="lazy"
              />
              <span class="visual-glow"></span>
            </div>
            <div class="skill-info">
              <div class="info-head">
                <span class="skill-index">01</span>
                <span class="skill-state">念起</span>
                <h4 class="skill-name">拢伞形 · 锁妄念</h4>
              </div>
              <p class="skill-desc">
                念起状态下，普攻会获得<span class="hl">【妄执】</span>。<span
                  class="hl"
                  >【妄执】</span
                >回满时，可施放共鸣技能·<em>拢伞形·锁妄念</em>进入念深。
              </p>
            </div>
          </article>

          <article class="skill-item">
            <div class="skill-visual">
              <img
                src="./img/skill2.png"
                alt="念深 · 解伞形·无舍念"
                loading="lazy"
              />
              <span class="visual-glow"></span>
            </div>
            <div class="skill-info">
              <div class="info-head">
                <span class="skill-index">02</span>
                <span class="skill-state">念深</span>
                <h4 class="skill-name">解伞形 · 无舍念</h4>
              </div>
              <p class="skill-desc">
                念深状态下，普攻会获得<span class="hl">【妄执】</span>。<span
                  class="hl"
                  >【妄执】</span
                >回满时，可施放共鸣技能·<em>解伞形·无舍念</em>。
              </p>
            </div>
          </article>

          <article class="skill-item">
            <div class="skill-visual">
              <img
                src="./img/skill3.png"
                alt="念劫 · 暝伞形·刻心念"
                loading="lazy"
              />
              <span class="visual-glow"></span>
            </div>
            <div class="skill-info">
              <div class="info-head">
                <span class="skill-index">03</span>
                <span class="skill-state">念劫</span>
                <h4 class="skill-name">暝伞形 · 刻心念</h4>
              </div>
              <p class="skill-desc">
                施放共鸣技能·解伞形·无舍念后一段时间内，可施放普攻·<em>暝伞形·刻心念</em>并进入念劫，技能结束后进入念起状态。
              </p>
              <p class="skill-desc skill-desc--damage">造成强力的普攻伤害。</p>
            </div>
          </article>
        </div>

        <div class="mechanics-bottom">
          <div class="mode-section">
            <div class="section-head">
              <h3 class="mode-heading">同奏机制</h3>
              <span class="section-sub">RESONANCE MODE</span>
              <span class="section-line"></span>
            </div>

            <div class="mode-list">
              <div class="mode-card">
                <span class="mode-tag">同奏</span>
                <div class="mode-content">
                  <p class="mode-desc">
                    施放共鸣解放后，锁暝获得<em>同奏</em>。<br />
                    锁暝拥有同奏并切换其他角色时，获得协契效果，可提升同奏体系队伍的<em>导电伤害</em>。
                  </p>
                </div>
              </div>

              <div class="mode-card">
                <span class="mode-tag mode-tag--gold">禁锁</span>
                <div class="mode-content">
                  <p class="mode-desc">
                    锁暝拥有同奏并施放共鸣技能·拢伞形·破隙则移除同奏，并获得<em>禁锁契主</em>效果，提升自身<em>暴击伤害</em>。
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="rotation-section">
            <div class="section-head">
              <h3 class="rotation-heading">输出流程</h3>
              <span class="section-sub">ROTATION</span>
              <span class="section-line"></span>
            </div>

            <div class="rotation-list">
              <div class="rotation-row">
                <span class="rotation-idx">1</span>
                <div class="rotation-seq">
                  <span class="seq-token">E</span>
                  <span class="seq-token">A</span>
                  <span class="seq-token">A</span>
                  <span class="seq-token is-op">-</span>
                  <span class="seq-token seq-token--key">R</span>
                  <span class="seq-note">同奏切人</span>
                </div>
              </div>

              <div class="rotation-row">
                <span class="rotation-idx">2</span>
                <div class="rotation-seq">
                  <span class="seq-note seq-note--pre">变奏入场</span>
                  <span class="seq-token">E</span>
                  <span class="seq-token">E</span>
                  <span class="seq-token is-op">-</span>
                  <span class="seq-token seq-token--key">Q</span>
                  <span class="seq-note">满协奏切人</span>
                </div>
              </div>
            </div>

            <div class="abbrev-row">
              <span class="abbrev"><b>A</b>普攻</span>
              <span class="abbrev"><b>Z</b>重击</span>
              <span class="abbrev"><b>E</b>共鸣技能</span>
              <span class="abbrev"><b>R</b>共鸣解放</span>
              <span class="abbrev"><b>Q</b>声骸</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ===================== 共鸣报告 ===================== -->
      <section class="panel report-panel" id="report" v-reveal>
        <div class="panel-head">
          <div class="head-title">
            <h2>共鸣状况</h2>
            <span class="head-sub">RESONANCE REPORT</span>
          </div>
          <span class="head-seal">谛天鉴</span>
        </div>

        <div class="report-header-bar">
          <div class="header-badge">机密</div>
          <div class="header-info">
            <span class="info-label">共鸣能力鉴定报告<em>6hz</em></span>
            <span class="info-val">能力：<em>十重契</em></span>
          </div>
          <div class="header-scanline"></div>
        </div>

        <div class="report-grid">
          <article class="report-card">
            <i class="rivet tl"></i><i class="rivet tr"></i>
            <i class="rivet bl"></i><i class="rivet br"></i>

            <div class="report-top">
              <div class="top-left">
                <span class="report-tag">频谱检验报告</span>
                <span class="report-title">「梦州谛天鉴·共鸣者档案」</span>
              </div>
              <span class="report-stamp">档案</span>
            </div>

            <div class="report-doc">
              <p class="doc-ellipsis">……</p>
              <p class="doc-text">
                此锁频之术，可将他人一缕频率纳入锁中。唯得其心服首肯，方可成契；或是其命将绝、神识离散，亦可趁其意志衰微而锁之。
              </p>
              <p class="doc-text">
                频率既存，则可借行其异能，然所承不过本源残余，威能有缺。且其身至多可容<span
                  class="hl"
                  >十道频率</span
                >，故其可掌握异能亦不过十。
              </p>
              <p class="doc-ellipsis">……</p>
            </div>

            <div class="report-dialogue">
              <div class="dialogue-line">
                <span class="d-quote">“</span
                >意思是锁暝州监能锁入十个不同频率，然后解开玄朱锁的时候，能使用被锁者的部分异能力？<span
                  class="d-quote"
                  >”</span
                >
              </div>
              <div class="dialogue-line">
                <span class="d-quote">“</span
                >应该是吧，这百年前的档案看着真有点费劲……难怪叫我们来重新梳理一遍。<span
                  class="d-quote"
                  >”</span
                >
              </div>
              <div class="dialogue-line">
                <span class="d-quote">“</span
                >你说，如果锁暝州监去向各州「岁主」要点频率，那岂不是强得不得了？<span
                  class="d-quote"
                  >”</span
                >
              </div>
              <div class="dialogue-line">
                <span class="d-quote">“</span
                >别傻了，报告里说只能锁一点点频率，像「岁主」那种等级的，锁进来的量也不足以使用相应的权能。<span
                  class="d-quote"
                  >”</span
                >
              </div>
              <div class="dialogue-line">
                <span class="d-quote">“</span
                >「岁主」是有点夸张了，但是锁一些强者的频率应该没问题吧？为什么锁暝州监不这么做呢？<span
                  class="d-quote"
                  >”</span
                >
              </div>
              <div class="dialogue-line dialogue-line--hl">
                <span class="d-quote">“</span
                >恐怕现在的她只会释放锁中的频率，对她而言，能立定契约的只有<em>那九人</em>了……<span
                  class="d-quote"
                  >”</span
                >
              </div>
            </div>
            <div class="report-foot">
              <span class="foot-line"></span>
              <span class="foot-text">梦州 · 谛天鉴 批注</span>
            </div>
          </article>

          <article class="report-card report-card--warn">
            <i class="rivet tl"></i><i class="rivet tr"></i>
            <i class="rivet bl"></i><i class="rivet br"></i>

            <div class="report-top">
              <div class="top-left">
                <span class="report-tag">超频诊断报告</span>
                <span class="report-title">「工作日志-H001」</span>
              </div>
              <span class="report-stamp stamp-warn">复勘</span>
            </div>

            <div class="report-doc">
              <p class="doc-ellipsis">……</p>
              <p class="doc-text">
                拉贝尔波形呈椭圆形，时域平稳，无异动，判为<span class="hl"
                  >常态</span
                >。
              </p>
              <p class="doc-text">
                超频临界值极高，频率稳固，无超频之患，亦无既往超频史。
              </p>
              <p class="doc-text">
                唯<span class="hl">频率波势偏弱，共鸣力呈渐衰迹象</span
                >，宜多留意。
              </p>
              <p class="doc-ellipsis">……</p>
            </div>

            <div class="report-dialogue">
              <div class="dialogue-line">
                <span class="d-quote">“</span
                >平稳……这可真没什么可说的，别说频谱波形了，我都没见锁暝州监的嘴角弧度变一下。<span
                  class="d-quote"
                  >”</span
                >
              </div>
              <div class="dialogue-line">
                <span class="d-quote">“</span
                >你真要改改这说话夸张的毛病……重点是这个，‘共鸣力呈渐衰迹象’你不觉得奇怪吗？<span
                  class="d-quote"
                  >”</span
                >
              </div>
              <div class="dialogue-line">
                <span class="d-quote">“</span
                >的确，这是近百年前的记录，已经过去这么久了，是当时的检测有疏忽？<span
                  class="d-quote"
                  >”</span
                >
              </div>
              <div class="dialogue-line dialogue-line--hl">
                <span class="d-quote">“</span
                >可能吧，但如果记录无误，<em>共鸣力衰退的锁暝州监是靠什么活过百年之久的</em>……<span
                  class="d-quote"
                  >”</span
                >
              </div>
            </div>
            <div class="report-foot">
              <span class="foot-line"></span>
              <span class="foot-text">超频诊断 · H001 批注</span>
            </div>
          </article>
        </div>
      </section>

      <!-- ===================== 专武 ===================== -->
      <section class="panel weapon-panel" id="weapon" v-reveal>
        <div class="panel-head">
          <div class="head-title">
            <h2>专武</h2>
            <span class="head-sub">SIGNATURE WEAPON</span>
          </div>
          <span class="head-seal">沉冥</span>
        </div>

        <div class="weapon-layout">
          <div class="weapon-visual">
            <span class="weapon-ring weapon-ring--outer"></span>
            <span class="weapon-ring weapon-ring--inner"></span>
            <div class="weapon-img-box">
              <span class="weapon-glow"></span>
              <img src="./img/weapon.png" alt="沉冥" loading="lazy" />
            </div>
            <div class="weapon-plate">
              <span class="plate-mark">✦</span>
              <span class="plate-text">沉冥</span>
              <span class="plate-mark">✦</span>
            </div>
          </div>

          <div class="weapon-meta">
            <div class="weapon-name-row">
              <h3>沉冥</h3>
              <span class="weapon-type">五星迅刀</span>
            </div>
            <p class="weapon-verse">
              「百机千变，应万难。伞下故影，锁尽凄雨瘴雷。」
            </p>

            <div class="weapon-passive">
              <div class="passive-head">
                <span class="passive-name">囚雷困雨</span>
                <span class="passive-en">WEAPON PASSIVE</span>
              </div>
              <div class="passive-steps">
                <span class="step">1</span><span class="step">2</span>
                <span class="step">3</span><span class="step">4</span>
                <span class="step">5</span>
                <span class="step-label">阶</span>
              </div>
            </div>

            <ul class="buff-list">
              <li class="buff-item">
                <span class="buff-dot"></span>
                <span class="buff-content"
                  >攻击提升 <b>12% / 15% / 18% / 21% / 24%</b>。</span
                >
              </li>
              <li class="buff-item">
                <span class="buff-dot"></span>
                <span class="buff-content"
                  >未拥有并获得同奏时，导电伤害提升
                  <b>30% / 37.5% / 45% / 52.5% / 60%</b>，持续 30 秒。</span
                >
              </li>
              <li class="buff-item">
                <span class="buff-dot"></span>
                <span class="buff-content">
                  未拥有并获得同奏时，队伍中角色获得<span
                    class="tag tag--jinian"
                    >【羁念】</span
                  >效果并移除<span class="tag tag--channian">【怅念】</span
                  >，导电伤害加成提升 <b>24% / 30% / 36% / 42% / 48%</b>，持续
                  30 秒。同名效果之间不可叠加。
                </span>
              </li>
              <li class="buff-item">
                <span class="buff-dot"></span>
                <span class="buff-content">
                  自身的协奏能量消耗，且消耗值低于 100 时，获得<span
                    class="tag tag--channian"
                    >【怅念】</span
                  >效果并移除队伍中角色的<span class="tag tag--jinian"
                    >【羁念】</span
                  >，自身导电伤害额外提升
                  <b>40% / 50% / 60% / 70% / 80%</b>，持续 14
                  秒，切换至其他角色时，该效果提前结束。
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div class="weapon-lore">
          <div class="lore-deco left"></div>
          <div class="lore-body">
            <p>以此伞庇众生，以此伞锁「恶瘴」。</p>
            <p>凄雨既歇，瘴雷已寂，唯余一片深暗囚于伞面。</p>
            <p class="lore-em">
              而无法归来的故影，隐于伞下，随她走过漫漫长路，从未远去。
            </p>
          </div>
          <div class="lore-deco right"></div>
        </div>
      </section>

      <!-- ===================== 珍物 ===================== -->
      <section class="panel treasure-panel" id="treasure" v-reveal>
        <div class="panel-head">
          <div class="head-title">
            <h2>九方故影</h2>
            <span class="head-sub">THE UMBRELLA</span>
          </div>
          <span class="head-seal">百机</span>
        </div>
        <div class="treasure-layout">
          <div class="treasure-img">
            <span class="img-glow"></span>
            <img src="./img/item1.png" alt="九方故影" loading="lazy" />
            <span class="img-corner tl"></span
            ><span class="img-corner br"></span>
          </div>
          <div class="treasure-text">
            <p>
              与二契相识后，锁暝请他打造一件机关兵器。二契起初提议双刀、剑等。先以武器为形，再于其上衍化万般变化，锁暝却只答<span
                class="treasure-em"
                >“伞便是最好”</span
              >。二契沉思片刻，终是会意。面对卷来狂风骤雨的「恶瘴」，华亭当有一伞，为众人遮风蔽雨。
            </p>
            <p>
              于是，一柄日后被唤作「九方故影」的机关伞应运而生。它可随心化作长短兵器，亦能分解为细小暗器远袭敌手，或展开为坚盾抵御攻势，由此<strong>百机，千变，应万难</strong>。
            </p>
          </div>
        </div>
      </section>

      <section class="panel treasure-panel treasure-panel--locks">
        <div class="panel-head">
          <div class="head-title">
            <h2>玄朱锁</h2>
            <span class="head-sub">THE TEN LOCKS</span>
          </div>
          <span class="head-seal">羁绊</span>
        </div>
        <div class="treasure-layout reverse">
          <div class="treasure-img">
            <span class="img-glow"></span>
            <img src="./img/item2.png" alt="玄朱锁" loading="lazy" />
            <span class="img-corner tl"></span
            ><span class="img-corner br"></span>
          </div>
          <div class="treasure-text">
            <p>
              锁暝施展「十重契」时，既需对方心甘情愿，又要分神维系，一旦心神稍有松懈，借来的异能便会散去。此技虽奇，却鲜有施展之机。
            </p>
            <p>
              直到与禁锁十契渐渐结下牵绊，她才亲手铸成玄朱锁，其由十二根玄黑柱、八枚朱红盖构成。共铸十锭，除与一至九契相对外，还留有一锭用于锁入「恶瘴」，有此玄朱锁，她得以常驻九契之力，不再受诸多限制。
            </p>
            <p class="treasure-highlight">
              <span class="treasure-em"
                >而早在铸成它时，锁暝便已存了几分私心——纵使有朝一日他们终将离去，她也不愿放手……</span
              >
            </p>
          </div>
        </div>
      </section>

      <section class="panel treasure-panel">
        <div class="panel-head">
          <div class="head-title">
            <h2>绾绣珑</h2>
            <span class="head-sub">THE HAIR ORNAMENT</span>
          </div>
          <span class="head-seal">故人</span>
        </div>
        <div class="treasure-layout">
          <div class="treasure-img">
            <span class="img-glow"></span>
            <img src="./img/item3.png" alt="绾绣珑" loading="lazy" />
            <span class="img-corner tl"></span
            ><span class="img-corner br"></span>
          </div>
          <div class="treasure-text">
            <p>
              四契随锁暝离开宅邸时，只带走了一件旧物——一枚以玲珑球为灵感、融入球形机关锁结构打造的发饰。那本是梦州的达官显贵们赠予她家族的珍宝之一，她独独选中它，只因觉得这绾绣珑最衬锁暝一头红发。
            </p>
            <p>
              自那以后，为锁暝梳发便成了四契的“特权”，直到后来又多了九契相伴。在「恶瘴」偶尔停息的时候，两人会一边替她束发，一边说起今日的逸闻趣事。
            </p>
            <p class="treasure-highlight">
              如今，锁暝每次束发前，她都会将属于四契与九契的玄朱锁置于案旁，诉说这一日的大事小情，<span
                class="treasure-em"
                >恍若她们仍在身侧，为她挽起发丝，笑谈着世间见闻。</span
              >
            </p>
          </div>
        </div>
      </section>

      <section class="panel treasure-panel treasure-panel--food">
        <div class="panel-head">
          <div class="head-title">
            <h2>华亭旧忆</h2>
            <span class="head-sub">A TASTE OF HOME</span>
          </div>
          <span class="head-seal">乡思</span>
        </div>
        <div class="treasure-layout reverse">
          <div class="treasure-img treasure-img--food">
            <span class="img-glow"></span>
            <img src="./img/food.png" alt="华亭旧忆" loading="lazy" />
            <span class="img-corner tl"></span
            ><span class="img-corner br"></span>
          </div>
          <div class="treasure-text">
            <div class="food-effect">
              <div class="effect-icon"><span class="icon-mark">✦</span></div>
              <div class="effect-text">
                <span class="effect-label">料理效果</span>
                <p>
                  提高队伍中所有共鸣者
                  <strong>44%</strong> 重击伤害加成，持续时间
                  <strong>30分钟</strong>。在多人游戏中仅对自己的角色生效。
                </p>
              </div>
            </div>
            <p>
              锁暝初到玄方城时，偶然尝到一道名为「客途秋忆」以茶汤入味的菜肴，这令她忆起故乡白茶。又从棠宁那得知，此菜本非以茶入馔，只是此地寻不到原本的食材，但思念这口味道的游子借茶寄思，方有今日模样。
            </p>
            <p>
              锁暝听后取来华亭白茶，亲手改制此菜。茶香清鲜，滋味淡雅，自此便常见于她案前。属下见状，暗中哀叹她乡思难遣，才独钟此味。
            </p>
            <p class="treasure-highlight">
              <span class="treasure-em"
                >然而，于她而言，不过是偏爱那一口清鲜，只是无意间，这道菜似乎也将故乡的滋味一并留在其中。</span
              >
            </p>
          </div>
        </div>
      </section>

      <!-- ===================== 共鸣链 ===================== -->
      <section class="panel chain-panel" id="chain" v-reveal>
        <div class="panel-head">
          <div class="head-title">
            <h2>共鸣链</h2>
            <span class="head-sub">RESONANCE CHAIN</span>
          </div>
          <span class="head-seal">六链</span>
        </div>

        <div class="chain-grid">
          <div class="chain-card">
            <div class="chain-header">
              <span class="chain-num">01</span>
              <h4 class="chain-name">身入凄雨</h4>
            </div>
            <div class="chain-desc">
              <p>共鸣技能·解伞形·无舍念免疫打断。</p>
              <p>
                变奏技能·拢伞形·闪裂、变奏技能·解伞形·碎霆、变奏技能·拢伞形·锁妄念·同奏、变奏技能·解伞形·旋雷破·同奏的伤害倍率提升
                <span class="num-hl">60%</span>。
              </p>
            </div>
          </div>

          <div class="chain-card is-key">
            <div class="chain-header">
              <span class="chain-num">02</span>
              <h4 class="chain-name">破雷斩恶</h4>
            </div>
            <div class="chain-desc">
              <p>暴击伤害提升 <span class="num-hl">40%</span>。</p>
              <p>
                施放延奏技能时，下一位登场的角色暴击伤害提升
                <span class="num-hl">10%</span
                >，每拥有一层【同奏增益】，暴击伤害额外提升
                <span class="num-hl">6%</span>，最多额外提升
                <span class="num-hl">24%</span
                >，持续30秒。若切换至其他角色则该效果提前结束。
              </p>
            </div>
          </div>

          <div class="chain-card is-key">
            <div class="chain-header">
              <span class="chain-num">03</span>
              <h4 class="chain-name">孤伞独行</h4>
            </div>
            <div class="chain-desc">
              <p>
                施放变奏技能·拢伞形·闪裂或变奏技能·解伞形·碎霆时，获得1层【同奏增益】，持续30秒，该效果每25秒生效一次。
              </p>
              <p class="sub-desc">
                ·
                若锁暝提供过【同奏增益】，在【同奏增益】存在期间内则仅刷新持续时间。
              </p>
              <p>
                施放共鸣解放时，锁暝自身普攻伤害加深
                <span class="num-hl">30%</span>，持续25秒。
              </p>
            </div>
          </div>

          <div class="chain-card">
            <div class="chain-header">
              <span class="chain-num">04</span>
              <h4 class="chain-name">承印于心</h4>
            </div>
            <div class="chain-desc">
              <p>锁暝攻击提升 <span class="num-hl">20%</span>。</p>
            </div>
          </div>

          <div class="chain-card">
            <div class="chain-header">
              <span class="chain-num">05</span>
              <h4 class="chain-name">契深未忘</h4>
            </div>
            <div class="chain-desc">
              <p>
                共鸣解放·暝伞形·重锁狱瘴的伤害倍率提升
                <span class="num-hl">40%</span>。
              </p>
            </div>
          </div>

          <div class="chain-card is-key">
            <div class="chain-header">
              <span class="chain-num">06</span>
              <h4 class="chain-name">九影相随</h4>
            </div>
            <div class="chain-desc">
              <p>
                队伍中的角色每层【同奏增益】的效果提升
                <span class="num-hl">50%</span>，最多对4层【同奏增益】生效。
              </p>
              <p>
                普攻·暝伞形·刻心念的伤害倍率提升
                <span class="num-hl">50%</span>。
              </p>
              <p>
                拥有禁锁契主效果时，锁暝暴击伤害额外提升
                <span class="num-hl num-hl--big">200%</span>。
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- ===================== 角色故事 ===================== -->
      <section class="panel story-panel" id="story" ref="storyRef">
        <div class="panel-head">
          <div class="head-title">
            <h2>角色故事</h2>
            <span class="head-sub">CHARACTER STORY</span>
          </div>
          <span class="story-indicator">
            {{ current + 1 }} / {{ stories.length }}
          </span>
        </div>

        <transition name="story-fade" mode="out-in">
          <article :key="stories[current]?.id" class="story-article">
            <div class="story-header">
              <span class="story-num">第 {{ current + 1 }} 篇</span>
              <h3 class="story-title">{{ stories[current]?.title }}</h3>
            </div>
            <div class="story-text">{{ stories[current]?.content }}</div>
          </article>
        </transition>

        <div class="story-nav">
          <button @click="prevStory" aria-label="上一篇">‹ 上一篇</button>
          <button @click="nextStory" aria-label="下一篇">下一篇 ›</button>
        </div>
      </section>
    </main>

    <!-- ===== 漂浮 Q 版小人 ===== -->
    <div class="floating-chibis">
      <img
        v-for="(pet, i) in chibiList"
        :key="i"
        :src="pet.src"
        :style="{ top: pet.top + 'px', left: pet.left + 'px' }"
        class="chibi-img"
        alt="Q版角色"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import gsap from "gsap";

const chainsBg = Array.from({ length: 18 }, () => {
  const hues: Array<"red" | "violet" | "gold"> = ["red", "violet", "gold"];
  return {
    left: Math.random() * 96 + 2,
    dur: 12 + Math.random() * 14,
    delay: -Math.random() * 20,
    opacity: 0.06 + Math.random() * 0.16,
    hue: hues[Math.floor(Math.random() * hues.length)],
  };
});

const stories = [
  {
    id: "1",
    title: "归城",
    content: `雨水刺得锁暝眼睛发酸，她用肩膀擦去眼角的雨滴，让视野清晰些，好能最后再看一次父母的面容，即便那已经是受「恶瘴」侵蚀，面目模糊的模样。随后，她握紧那柄几乎与自己等高的铁铲，将最后一抔泥土轻轻覆下。坟墓另一侧，后来成为一契的少女也放下铁铲，她自幼受锁暝父母照顾，早已将这一家视作至亲。

“这之后……我们怎么办？”

锁暝望向远方，抬手指着漆黑雨幕中城门紧闭的华亭，“他们关上门，要我们成为吸引「恶瘴」的饵料……我要，带大家回去。”

只是，华亭城外早已是被弃之不顾的土地，除「恶瘴」威胁外，还有贼人恶霸四契，拉帮结派。锁暝走遍华亭城外一座座村落，见到那些流离失所的孤儿、被恶霸驱逐的百姓、因「恶瘴」失去一切的幸存者……城外百姓需要新的秩序，而锁暝也需要能够维系众人生计的物资与据点。于是她驱散贼寇，迎击「恶瘴」护住村落。岁月流转，越来越多的人聚集于她身旁，华亭城外，也有了一片属于他们的立足之地，锁暝也做好了万全准备……

终于有一日，「恶瘴」再度压境，华亭守军一如往昔，尽数退守城内躲避威胁。他们的职责从来不是救人，而是守住城门，不让任何人闯入。

锁暝独自迎向伴随「恶瘴」而来的残象，与此同时，一契带着托人制作的「千钧顶」来到城门前，伴随着机关转动，千钧顶缓缓撑开厚重的城门。下一刻，等候已久的人群涌入华亭城。当锁暝斩尽最后一头残象，踏入城门时，士兵紧握兵刃，与众人对峙，神色惊惶中催促百姓关紧城门，就好像只要隔绝城外，名为「恶瘴」的灾祸便不会降临。

锁暝的目光越过惶惶不安的人群，越过鳞次栉比的屋舍，最终落在城中央那座高踞其上的宅邸。那是华亭主簿的府邸，在风雨飘摇的城中依旧富丽堂皇，格外刺眼。

锁暝微微颔首，她筹谋多年的道路，直到此时，方才迈出第一步。`,
  },
  {
    id: "2",
    title: "聚契",
    content: `锁暝清楚，闯入华亭后直取主簿固然不难，可城中势力盘根错节，主簿一死，华亭未必就此安定，如此行事她也难以服众，于是锁暝将目标转为了那些支撑主簿权势的人。

第一个，是城中飞扬跋扈的刀客，此人刀术精湛，共鸣能力强悍，让挥出的斩击削铁如泥，受主簿重金招揽后，又借其声势招聚党羽，城中诸多对主簿不满者，也忌惮于他的刀刃。

锁暝寻到他时，他正于酒楼纵酒寻欢，其随从见来者不过一个身材娇小的姑娘，便放她上楼，还忍不住笑道：“小孩儿也懂喝酒？”

未过片刻，酒楼窗棂轰然碎裂，那刀客已被锁暝自二楼掷出，重重摔在长街之上，慕强而来党羽们一时噤声，这才想起几日前西城门外的传闻——率众闯入华亭的，正是一位个子不高的红发少女。

酒意散尽，刀客翻身而起，与锁暝鏖战数十回合，最终力竭落败，锁暝质问他“有此一身武艺，何必为恶人驱使？跟我走，铲灭「恶瘴」。”

成为三契后，他承认当时并不在意锁暝有什么志向，只是折服于她恃强却不凌弱的姿态，令他自惭形秽。

解决了主簿的刀剑，锁暝又将目光投向另一股势力，那是华亭首屈一指的豪商世家。世代经营金玉锦绣，即便货品并非世间奇珍，却胜在取之不竭，由此富甲一方。锁暝本欲借其财力，却在拜访时遇见了家族的小姐，少女寥寥数语，皆是宅邸之外的风景；欲言又止之间，藏着难以出口的隐情。

一契察觉异样，劝锁暝暂且静观。可当家主笑言「恶瘴」围城未尝不是天赐良机，正好借此囤积居奇，不必急着与「恶瘴」决战时，锁暝已不愿再多言，当夜，她潜入宅邸，将那位少女带了出来，从她口中了解到真相。

少女拥有仿造物件的异能，家族凭此聚敛无数财富，也因此将她终年囚于深宅。每有珍宝运来，便命她一件件仿造；「恶瘴」封城后，再无人能够窥见这一切，她便愈发成了永不停歇的聚宝盆，漫长的囚禁与无休止地榨取共鸣力，早已令她心神枯槁，锁暝对她说，“我能带你离开，可除了自由，我什么都给不了你。”而少女的回应则是义无反顾。

后来，每当四契替锁暝梳起长发时，锁暝常常叹息，“若当初只是带你离开宅邸就好了，不该再让你卷入这一切。”四契则是摇摇头，挽起她的红发，低声念着她新写的诗句，婉转地传达谢意。`,
  },
  {
    id: "3",
    title: "执伞",
    content: `“自你请我打造「千钧顶」那日起，已经过去多少年了？你兑现了当初的承诺，带着城外的人回到了华亭，也灭了那罪恶滔天的主簿。城外人涌入后，华亭没有陷入混乱，反倒渐渐有了新的气象，这一切，都是你和那群追随者挣来的。

“如今的华亭相信你的每一句话，相信你手中的力量，仿佛只要你振臂一呼，众人便能随你出城，将「恶瘴」彻底扫尽。

“可城中的人没有见过真正的「恶瘴」，他们不曾见过黑雨覆地、草木尽枯，不曾见过至亲被它侵蚀，面目全非。可你我，都见过。当年答应替你打造「千钧顶」，我只是想把城外的人带回家。至于击败「恶瘴」……我从未信过。所以，不必再劝我了。我不会再为此倾尽余力，也劝你……莫再执着于此了。”

锁暝看着眼前那杯透明无色的华亭白茶，杯底的天工部徽记微微荡漾。

“如今的华亭，并非我一人所成。六契善察人心，亦善言辞。是她奔走于街巷之间，周旋于城中诸势，替我赢得了百姓的信任。若无她，华亭未必愿意相信我。

“至于「恶瘴」……有一位医者如你所说，亲眼见过凄雨蚀骨、瘴雷噬人。若她沉溺于悲痛，便不会穷究「恶瘴」为何物，更不会寻到与之相抗的办法。五契设想了一种能抵御「恶瘴」侵蚀的面罩，只待工匠将其铸成，且只要控制数量，四契能仿造多个性能完备的面罩。如此，我们便有了踏入凄雨的资格，当然，这还不够，我要你打造一把武器……”

老者聚精会神，等着锁暝开口。

“我要夺取它的力量，我会在交战中不断削弱「恶瘴」，哪怕只能夺来一丝凄雨、一缕瘴雷，也要将它们锁入武器之中。即便能夺取的频率有极限，但我会驾驭它的力量，并找到击败它的方法。”

“那么……你想要一件怎样的兵器？迅刀？长刃？若辅以机关，应当——”

“伞便是最好。”

“伞……？”他望向窗外，“原来如此，面对那漫天凄雨，确是没什么比一柄能为华亭遮风蔽雨的伞更好。”

他收回目光，重新望向锁暝。

“既如此……按你的规矩，如今我该排第几？七契？”

锁暝终于端起茶盏，露出难得的微笑。

“这个位置，我一直替你留着，二契。”`,
  },
  {
    id: "4",
    title: "定策",
    content: `八契加入禁锁十契后不久，玄朱锁终于铸成，锁暝想以此借用禁锁十契的共鸣能力，以应对「恶瘴」。可这种用法，她此前从未尝试过，纵然神色如常，心中终究有几分踌躇，一时竟不知该向谁先开这个头。而七契自告奋勇，说他身为军策府一员，自是要敢为人先。

当年锁暝铲除华亭主簿后，军策府终于摆脱桎梏，府中上下皆愿在履行原有职责的同时，协助锁暝。唯独七契始终不肯低头。他固执地认为，主簿纵然罪孽深重，也终究是名正言顺的华亭执掌者，锁暝不过一介平民，不该取而代之。那段时日，他几乎处处与锁暝作对。直到锁暝带他走出华亭，看到城外村落埋没于凄雨之下，断壁残垣间，七契久久伫立，终是红了眼眶。他问锁暝，能否让华亭城不再遭此劫难？

答案不言而喻，自那以后，他仍是那个事事循规蹈矩的七契，总把责任揽在自己肩上，也总说无论锁暝今日身居何位，终究都是华亭百姓，他会尽力保护诸位。锁暝自然不会拒绝他的好意，旋即动手将七契的些许频率封入锁中。下一刻，一团水雾自她掌心缓缓凝聚，虽然微弱，但正是七契的异能。而此时锁暝放置在一旁的伞忽然震颤，伴随着轰鸣，一道赤黑色雷霆骤然从伞中迸发，将院墙轰然击碎。

众人惊诧中，八契踱步至断墙前，望着碎石间仍在跳动的瘴雷，沉默片刻后开口。

“你从前……可曾同时驾驭过两种力量？”锁暝摇头，“你的心神始终分出一部分，镇压着伞中封存的「恶瘴」。如今再借七契之力，或许正是因此生变。”

八契是由七契引荐而来的，锁暝还记得初次相见时，她单刀直入，让锁暝将这些年来与「恶瘴」交锋的每一场战斗，从头到尾细细说来。一谈便是一整日，直至暮色将尽，两人才推门而出。锁暝告诉众人，击败「恶瘴」的计策已成，在八契的计划中，必须有人随锁暝一同闯入「恶瘴」缠绕周身的黑云，在锁暝牵制它的瞬间，将灌注八契共鸣能力的匕首刺入其体内，逼它脱离浓云的保护，与众人决战。

可禁锁十契各司其职，无人能担此任，仍需再寻一人，最后一人……`,
  },
  {
    id: "5",
    title: "寄心",
    content: `“如此，便是我与八契相识的经过。”锁暝舒了一口气，身子放松了力气，靠在椅背上，“至于最后的九契……”

她停顿片刻后开口，“我们的相遇，倒是寻常。那日我独自走在街上，只瞧见一块会飘的……粘糕。”

话音刚落，「岁主」微微颔首，锁暝猜祂或许是在笑，“她饿坏了，仗着能隐去身形，在街边偷东西吃。我便站在那里，等她从身旁经过时，伸脚绊了她一下，九儿摔在地上，现了形，转过身像是要骂我两句，但欲言又止。”

“你吓着她了。”

“是啊。”锁暝轻轻点头，“那一刻，我的表情很是可怕吧？因为我想着就是她了，第九契，我要她靠近「恶瘴」施与致命一击，接着……她就会被「恶瘴」发现，殒命当场。”

“你把这些，都告诉她了。”

“都告诉了。”锁暝伸手抚过身边的玄朱锁，“可又有什么用？九儿总喜欢跟在我身后，一口一个‘锁暝姐姐’地叫着。无论我说什么，她都会点头答应。连头发，也要梳得与我一样。不过几日工夫，她便再也不怕我了，无论我怎么劝、怎么说，她都只是笑……什么都不怕。”

锁暝声音越来越轻，逐渐变为沉默和叹息，「岁主」知晓她不需安慰，连这份悲伤她都想牢牢刻在心中。祂无需多言，只要为锁暝指明前路便好。

“锁暝，谢谢你为华亭做的一切，但我已没有什么能够嘉奖你的，甚至，还要请你继续为了梦州而战。”

“这样便够了。”锁暝抬起头，脸上再无先前的阴郁，“告诉我，你需要我做什么，该如何才能让「恶瘴」，永远不再出现在梦州。”

“……好，把玄朱锁取出来吧，我要将最后的嘱托交于你。”`,
  },
];

const current = ref(0);
const storyRef = ref<HTMLElement | null>(null);

/* ===== 章节导航：右侧那串小灯 ===== */
const chapters = [
  { id: "intro", num: "序", label: "楔子" },
  { id: "lore", num: "壹", label: "剧情纪事" },
  { id: "mechanics", num: "贰", label: "核心机制" },
  { id: "report", num: "叁", label: "共鸣状况" },
  { id: "weapon", num: "肆", label: "专武" },
  { id: "treasure", num: "伍", label: "珍物" },
  { id: "chain", num: "陆", label: "共鸣链" },
  { id: "story", num: "柒", label: "角色故事" },
];
const activeChapter = ref(chapters[0].id);

function scrollToChapter(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 48;
  window.scrollTo({
    top: Math.max(0, top),
    behavior: reducedMotion ? "auto" : "smooth",
  });
  activeChapter.value = id;
}

let chapterFrame = 0;
function probeChapter() {
  chapterFrame = 0;
  const line = window.innerHeight * 0.34;
  let currentId = chapters[0].id;
  for (const c of chapters) {
    const el = document.getElementById(c.id);
    if (!el) continue;
    if (el.getBoundingClientRect().top <= line) currentId = c.id;
  }
  if (currentId !== activeChapter.value) activeChapter.value = currentId;
}

function onScrollProbe() {
  if (chapterFrame) return;
  chapterFrame = window.requestAnimationFrame(probeChapter);
}

function prevStory() {
  current.value = (current.value - 1 + stories.length) % stories.length;
  storyRef.value?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function nextStory() {
  current.value = (current.value + 1) % stories.length;
  storyRef.value?.scrollIntoView({ behavior: "smooth", block: "start" });
}

interface Chibi {
  src: string;
  top: number;
  left: number;
}
const chibiList = ref<Chibi[]>([]);
/* 记住这些 <img>，卸载时才能真正停掉它们的无限漂移 */
const chibiEls: HTMLImageElement[] = [];

const reducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

onMounted(async () => {
  window.addEventListener("scroll", onScrollProbe, { passive: true });
  probeChapter();

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const isMobile = window.innerWidth <= 768;
  const imgWidth = isMobile ? 72 : 100;
  const imgHeight = isMobile ? 72 : 100;

  const pngFiles = Array.from(
    { length: 2 },
    (_, k) => `${import.meta.env.BASE_URL}QImages/1 (${k + 1}).png`
  );
  const gifFiles = Array.from(
    { length: 10 },
    (_, k) => `${import.meta.env.BASE_URL}QImages/2 (${k + 1}).webp`
  );
  const allImages = [...pngFiles, ...gifFiles];

  function shuffle<T>(array: T[]): T[] {
    const a = array.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const pickCount = isMobile ? 1 : 3;
  const picks = shuffle(allImages).slice(0, pickCount);

  chibiList.value = picks.map((src) => ({
    src,
    left: Math.random() * (vw - imgWidth),
    top: Math.random() * (vh - imgHeight),
  }));

  await nextTick();
  chibiEls.length = 0;
  const imgs = document.querySelectorAll<HTMLImageElement>(".chibi-img");
  imgs.forEach((img) => chibiEls.push(img));

  imgs.forEach((img, index) => {
    const padding = 200;
    if (reducedMotion) {
      img.style.opacity = "1";
      return;
    }

    gsap.fromTo(
      img,
      { opacity: 0, scale: 0.5 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "back.out(2)",
        delay: 0.2 * index,
      }
    );

    img.addEventListener("mouseenter", () => {
      gsap.killTweensOf(img);
      gsap.to(img, {
        x: "+=" + ((Math.random() - 0.5) * 400).toFixed(0),
        y: "+=" + ((Math.random() - 0.5) * 400).toFixed(0),
        duration: 1.2,
        ease: "back.out(2)",
        onComplete: () => animate(img),
      });
    });

    const animate = (el: HTMLImageElement) => {
      const rect = el.getBoundingClientRect();
      let deltaX = (Math.random() - 0.5) * 200;
      let deltaY = (Math.random() - 0.5) * 200;
      const nextX = rect.x + deltaX;
      const nextY = rect.y + deltaY;

      if (nextX < padding) deltaX = padding - rect.x;
      if (nextX + el.width > window.innerWidth - padding)
        deltaX = window.innerWidth - padding - (rect.x + el.width);
      if (nextY < padding) deltaY = padding - rect.y;
      if (nextY + el.height > window.innerHeight - padding)
        deltaY = window.innerHeight - padding - (rect.y + el.height);

      gsap.to(el, {
        x: `+=${deltaX.toFixed(0)}`,
        y: `+=${deltaY.toFixed(0)}`,
        rotation: `+=${((Math.random() - 0.5) * 60).toFixed(0)}`,
        duration: 2 + Math.random() * 2,
        ease: "power1.inOut",
        onComplete: () => animate(el),
      });
    };
    animate(img);
  });
});

onUnmounted(() => {
  window.removeEventListener("scroll", onScrollProbe);
  if (chapterFrame) {
    window.cancelAnimationFrame(chapterFrame);
    chapterFrame = 0;
  }
  /* 直接持有引用：此时 DOM 已卸载，querySelectorAll 是查不到东西的 */
  chibiEls.forEach((img) => gsap.killTweensOf(img));
  chibiEls.length = 0;
});
</script>

<style scoped lang="scss">
/* ============================================================
   锁暝配色
   ============================================================ */
$ink: #060305;
$ink-2: #0f0508;
$ink-3: #1c070e;

$blood: #5c0a16;
$red: #c0142f;
$red-lt: #ff3a56;
$red-glow: #ff8a9b;

$violet: #6a3ae0;
$violet-lt: #a98bff;

$gold: #c2a061;
$gold-lt: #f2ddab;

$mirror: #e9dde0;
$paper: #fdf4f5;

/* 字体分工：书法体做大标题，宋体做正文，解决书法体小字发虚问题 */
$font-title: "MaShanZheng", "全字库正宋体", serif;
$font-body: "Noto Serif SC", "Source Han Serif SC", "Songti SC", "STSong",
  "SimSun", serif;

/* ============================================================
   页面基底
   ============================================================ */
.suoming-page {
  position: relative;
  min-height: 100vh;
  background: $ink;
  color: $paper;
  font-family: $font-body;
  overflow-x: hidden;
  isolation: isolate;
  font-size: 16px;
  line-height: 1.9;
  -webkit-font-smoothing: antialiased;
}

/* ============================================================
   背景层
   ============================================================ */
.bg-layer {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.bg-ink {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0.5;
  &--1 {
    width: 70vw;
    height: 70vw;
    top: -18%;
    left: -12%;
    background: radial-gradient(circle, rgba($blood, 0.9), transparent 68%);
    animation: inkDrift1 26s ease-in-out infinite;
  }
  &--2 {
    width: 55vw;
    height: 55vw;
    bottom: -14%;
    right: -10%;
    background: radial-gradient(circle, rgba($red, 0.55), transparent 70%);
    animation: inkDrift2 32s ease-in-out infinite;
  }
  &--3 {
    width: 46vw;
    height: 46vw;
    top: 36%;
    left: 42%;
    background: radial-gradient(circle, rgba($violet, 0.32), transparent 72%);
    animation: inkDrift3 40s ease-in-out infinite;
  }
  &--4 {
    width: 30vw;
    height: 30vw;
    top: 60%;
    left: 8%;
    background: radial-gradient(circle, rgba($gold, 0.16), transparent 75%);
    animation: inkDrift4 36s ease-in-out infinite;
  }
}
@keyframes inkDrift1 {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(4%, 3%) scale(1.06);
  }
}
@keyframes inkDrift2 {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(-3%, -4%) scale(1.08);
  }
}
@keyframes inkDrift3 {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.22;
  }
  50% {
    transform: translate(-4%, 3%) scale(1.12);
    opacity: 0.4;
  }
}
@keyframes inkDrift4 {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.16;
  }
  50% {
    transform: translate(3%, -3%) scale(1.06);
    opacity: 0.28;
  }
}

.bg-chains {
  position: absolute;
  inset: 0;
}
.chain-thread {
  position: absolute;
  top: -10%;
  width: 1px;
  height: 120%;
  animation: chainFall linear infinite;
  transform-origin: top center;
  filter: blur(0.3px);
  &--red {
    background: linear-gradient(
      180deg,
      transparent 0%,
      rgba($gold, 0.5) 18%,
      rgba($red-lt, 0.7) 50%,
      rgba($gold, 0.4) 82%,
      transparent 100%
    );
    &::after {
      background: $gold-lt;
      box-shadow: 0 0 8px 2px rgba($red-lt, 0.7);
    }
  }
  &--violet {
    background: linear-gradient(
      180deg,
      transparent 0%,
      rgba($violet-lt, 0.4) 18%,
      rgba($violet, 0.75) 50%,
      rgba($violet-lt, 0.35) 82%,
      transparent 100%
    );
    &::after {
      background: $violet-lt;
      box-shadow: 0 0 10px 2px rgba($violet-lt, 0.75);
    }
  }
  &--gold {
    background: linear-gradient(
      180deg,
      transparent 0%,
      rgba($gold-lt, 0.4) 20%,
      rgba($gold, 0.7) 50%,
      rgba($gold-lt, 0.3) 82%,
      transparent 100%
    );
    &::after {
      background: $gold-lt;
      box-shadow: 0 0 8px 2px rgba($gold, 0.7);
    }
  }
  &::after {
    content: "";
    position: absolute;
    left: -1.5px;
    bottom: 0;
    width: 4px;
    height: 4px;
    border-radius: 50%;
  }
}
@keyframes chainFall {
  from {
    transform: translateY(-100%) rotate(1.2deg);
  }
  to {
    transform: translateY(100%) rotate(-1.2deg);
  }
}

.bg-grain {
  position: absolute;
  inset: 0;
  opacity: 0.035;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
.bg-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 90% 80% at 50% 42%,
    transparent 40%,
    rgba(0, 0, 0, 0.72) 100%
  );
}

/* ============================================================
   容器与基础面板
   ============================================================ */
.container {
  position: relative;
  z-index: 1;
  width: min(1120px, calc(100% - 48px));
  margin: 0 auto;
  padding: 80px 0 120px;
  display: flex;
  flex-direction: column;
  gap: 72px;
}

/* ---------- 章节导航 ---------- */
.chapter-nav {
  position: fixed;
  right: 24px;
  top: 50%;
  z-index: 60;
  display: none;
  flex-direction: column;
  gap: 14px;
  transform: translateY(-50%);

  /* 一条极细的导轨，点亮的部分跟着滚动走 */
  &::before {
    content: "";
    position: absolute;
    top: 4px;
    bottom: 4px;
    right: 5px;
    width: 1px;
    background: linear-gradient(
      180deg,
      transparent,
      rgba($gold, 0.2) 12%,
      rgba($gold, 0.2) 88%,
      transparent
    );
  }
}

.chapter-nav__item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 0;
  background: none;
  border: 0;
  cursor: pointer;
  color: rgba($paper, 0.4);
  opacity: 0.62;
  transition: opacity 0.3s ease, color 0.3s ease;

  &:hover,
  &:focus-visible {
    opacity: 1;
    color: $gold-lt;
    outline: none;
  }

  &.is-active {
    opacity: 1;
    color: $gold-lt;
  }
}

.chapter-nav__num {
  font-family: $font-title;
  font-size: 12px;
  letter-spacing: 0.08em;
  line-height: 1;
}

.chapter-nav__dot {
  position: relative;
  z-index: 1;
  width: 5px;
  height: 5px;
  margin-right: 2.5px;
  background: rgba($paper, 0.3);
  transform: rotate(45deg);
  transition: all 0.35s ease;
}

.chapter-nav__item.is-active .chapter-nav__dot {
  background: $red-lt;
  box-shadow: 0 0 10px rgba($red-lt, 0.85), 0 0 3px rgba($paper, 0.9);
  transform: rotate(45deg) scale(1.35);
}

.chapter-nav__label {
  position: absolute;
  right: 20px;
  top: 50%;
  padding: 4px 9px;
  font-family: $font-body;
  font-size: 11.5px;
  letter-spacing: 0.14em;
  white-space: nowrap;
  color: rgba($gold-lt, 0.9);
  background: rgba(9, 3, 6, 0.9);
  border: 1px solid rgba($gold, 0.22);
  opacity: 0;
  pointer-events: none;
  transform: translate(6px, -50%);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.chapter-nav__item:hover .chapter-nav__label,
.chapter-nav__item:focus-visible .chapter-nav__label {
  opacity: 1;
  transform: translate(0, -50%);
}

@media (min-width: 1280px) {
  .chapter-nav {
    display: flex;
  }
}

.panel {
  position: relative;
  padding: 44px 48px;
  background: linear-gradient(160deg, rgba($ink-2, 0.92), rgba($ink-3, 0.88));
  border: 1px solid rgba($gold, 0.15);
  border-radius: 4px;
  box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.5),
    0 10px 40px -20px rgba($red, 0.2);
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba($red, 0.6),
      rgba($gold, 0.6),
      transparent
    );
  }
}

.panel-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba($gold, 0.15);
}
.head-title h2 {
  margin: 0;
  font-family: $font-title;
  font-size: 32px;
  font-weight: 400;
  letter-spacing: 0.12em;
  color: $paper;
  text-shadow: 0 0 12px rgba($gold, 0.4);
}
.head-sub {
  display: block;
  margin-top: 8px;
  font-family: "Cinzel", serif;
  font-size: 11px;
  letter-spacing: 0.4em;
  color: rgba($gold, 0.65);
}
.head-seal {
  flex-shrink: 0;
  padding: 7px 14px;
  font-size: 15px;
  letter-spacing: 0.2em;
  color: $red-glow;
  border: 1px solid rgba($red, 0.5);
  background: rgba($blood, 0.25);
  transform: rotate(-2deg);
  animation: sealPulse 4s ease-in-out infinite;
  text-shadow: 0 0 8px rgba($red, 0.8);
}
@keyframes sealPulse {
  0%,
  100% {
    box-shadow: 0 0 0 rgba($red, 0);
    border-color: rgba($red, 0.4);
  }
  50% {
    box-shadow: 0 0 16px rgba($red, 0.6), inset 0 0 10px rgba($red, 0.2);
    border-color: rgba($red-lt, 0.8);
  }
}

.panel-intro {
  margin: 0 0 32px;
  padding-left: 16px;
  border-left: 2px solid rgba($red, 0.5);
  font-size: 16px;
  line-height: 2.1;
  color: rgba($paper, 0.85);
}

/* ============================================================
   HERO (略作调整，大标题使用书法体)
   ============================================================ */
.hero {
  position: relative;
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 56px;
  align-items: center;
  padding: 24px 0 12px;
}
.hero__portrait {
  position: relative;
}

/* 手写便签：贴在立绘右下角 */
.hero-note {
  position: absolute;
  right: -34px;
  bottom: 96px;
  z-index: 3;
  font-size: 14px;
  line-height: 1.85;

  &__sign {
    display: block;
    margin-top: 6px;
    text-align: right;
    font-family: var(--sm-font-body);
    font-size: 11.5px;
    letter-spacing: 0.06em;
    color: rgba(58, 31, 34, 0.55);
  }
}
.portrait-frame {
  position: relative;
  aspect-ratio: 3/4;
  overflow: hidden;
  border: 1px solid rgba($gold, 0.4);
  background: radial-gradient(
      circle at 50% 0%,
      rgba($red, 0.25),
      transparent 60%
    ),
    linear-gradient(160deg, $ink-2, $ink);
  box-shadow: 0 20px 50px -20px rgba($red, 0.6),
    inset 0 0 20px rgba(0, 0, 0, 0.8);
}
.portrait-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
  filter: saturate(0.9) contrast(1.1);
}
.portrait-badge {
  margin: -18px 16px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 12px;
  background: $ink-2;
  border: 1px solid rgba($gold, 0.3);
  position: relative;
  z-index: 2;
}
.badge-seal {
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  background: $blood;
  color: $paper;
  border: 1px solid $red-lt;
  transform: rotate(-4deg);
  font-weight: bold;
}
.badge-text {
  font-size: 14px;
  color: $gold-lt;
  letter-spacing: 0.15em;
}

.hero__meta {
  position: relative;
}
/* ---------- 竖排底纹 ---------- */
.meta-vertical {
  position: absolute;
  top: -8px;
  right: 0;
  writing-mode: vertical-rl;
  text-orientation: upright;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.55em;
  user-select: none;
  pointer-events: none;
  background: linear-gradient(180deg, $gold 0%, $red-lt 44%, $violet-lt 100%);
  background-size: 100% 240%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: verticalFlow 10s ease-in-out infinite;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    right: -10px;
    width: 1px;
    height: 100%;
    background: linear-gradient(
      180deg,
      transparent,
      rgba($gold, 0.35) 30%,
      rgba($red, 0.25) 70%,
      transparent
    );
  }
}

@keyframes verticalFlow {
  0%,
  100% {
    background-position: 0% 0%;
    opacity: 0.4;
  }
  50% {
    background-position: 0% 100%;
    opacity: 0.72;
  }
}
.meta-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 16px;
  padding: 6px 14px;
  font-size: 14px;
  color: $gold-lt;
  border: 1px solid rgba($gold, 0.3);
  background: rgba($ink, 0.5);
}
.eyebrow-dot {
  width: 6px;
  height: 6px;
  background: $red-lt;
  border-radius: 50%;
  box-shadow: 0 0 8px $red-lt;
}
.meta-name {
  display: flex;
  align-items: baseline;
  gap: 24px;
  margin: 0;
}
.name-cn {
  font-family: $font-title;
  font-size: clamp(64px, 8vw, 100px);
  font-weight: 400;
  background: linear-gradient(100deg, $paper, $gold-lt, $red-glow);
  -webkit-background-clip: text;
  color: transparent;
  line-height: 1;
}
.name-en {
  font-family: "Cinzel", serif;
  font-size: 15px;
  letter-spacing: 0.5em;
  color: rgba($red-lt, 0.8);
}
.meta-rule {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 200px;
  margin: 24px 0;
}
.rule-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba($gold, 0.6),
    transparent
  );
}
.rule-lock {
  width: 8px;
  height: 8px;
  border: 1px solid $red-lt;
  transform: rotate(45deg);
}
.meta-intro {
  margin: 0 0 20px;
  font-size: 16px;
  line-height: 2.1;
  color: rgba($paper, 0.9);
}
.meta-lead {
  margin: 0 0 24px;
  padding: 16px 20px;
  background: rgba($blood, 0.15);
  border-left: 2px solid $red-lt;
  font-size: 16px;
  line-height: 2.1;
  color: rgba($paper, 0.85);
}
.lead-quote {
  font-style: normal;
  font-weight: bold;
  color: $gold-lt;
}
.meta-cv {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-top: 20px;
  border-top: 1px dashed rgba($gold, 0.2);
}
.cv-label {
  padding: 2px 8px;
  background: $gold;
  color: $ink;
  font-weight: bold;
  font-family: "Cinzel", serif;
  font-size: 12px;
}
.cv-list {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: rgba($paper, 0.7);
}

/* ============================================================
   剧情纪事（卡片流重构）
   ============================================================ */
.lore-timeline {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.lore-card {
  position: relative;
  display: flex;
  gap: 24px;
  padding: 28px;
  background: rgba($ink-2, 0.6);
  border: 1px solid rgba($gold, 0.15);
  border-left: 3px solid rgba($red, 0.5);
  border-radius: 4px;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;

  &:hover {
    transform: translateX(6px);
    border-left-color: $red-lt;
    box-shadow: -4px 4px 20px rgba($red, 0.15);
    background: rgba($ink-2, 0.85);
  }

  &.is-key {
    border-left-color: $gold;
    background: linear-gradient(90deg, rgba($blood, 0.15), rgba($ink-2, 0.6));
    &:hover {
      border-left-color: $gold-lt;
      box-shadow: -4px 4px 24px rgba($gold, 0.2);
    }
  }
}

.lore-card-num {
  font-family: "Cinzel", serif;
  font-size: 36px;
  font-weight: 700;
  color: rgba($gold, 0.4);
  line-height: 1;
  flex-shrink: 0;
  padding-top: 4px;
  .lore-card.is-key & {
    color: rgba($red-lt, 0.8);
    text-shadow: 0 0 12px rgba($red, 0.5);
  }
}

.lore-card-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.lore-card-head {
  display: flex;
  align-items: center;
  gap: 12px;
}
.lore-era {
  font-size: 15px;
  font-weight: bold;
  color: $gold-lt;
  letter-spacing: 0.1em;
}
.lore-tag {
  padding: 1px 8px;
  font-size: 12px;
  border: 1px solid rgba($paper, 0.3);
  color: rgba($paper, 0.7);
  border-radius: 2px;
  &--key {
    color: $red-glow;
    border-color: rgba($red, 0.5);
    background: rgba($blood, 0.2);
  }
}

.lore-title {
  margin: 0;
  font-family: $font-title;
  font-size: 24px;
  font-weight: 400;
  color: $paper;
  letter-spacing: 0.05em;
}

.lore-para {
  margin: 0;
  font-size: 16px;
  line-height: 2.1;
  color: rgba($paper, 0.85);
  strong {
    color: $gold-lt;
    font-weight: bold;
  }
}

.lore-quote {
  margin-top: 8px;
  padding: 12px 16px;
  background: rgba($ink, 0.4);
  border-left: 2px solid $violet;
  color: $violet-lt;
  font-size: 15px;
  font-style: italic;
}
.quote-mark {
  opacity: 0.5;
}

.lore-trial {
  margin-top: 8px;
  padding: 16px;
  background: rgba($violet, 0.08);
  border: 1px dashed rgba($violet, 0.4);
  border-radius: 4px;
}
.trial-label {
  display: block;
  font-size: 13px;
  font-weight: bold;
  color: $violet-lt;
  margin-bottom: 4px;
}
.trial-text {
  margin: 0;
  font-size: 15px;
  color: rgba($paper, 0.8);
}

.lore-quote-inline {
  font-weight: bold;
  color: $gold-lt;
  &::before {
    content: "「";
    color: rgba($paper, 0.5);
  }
  &::after {
    content: "」";
    color: rgba($paper, 0.5);
  }
}

/* ============================================================
   核心机制 (长图单列流)
   ============================================================ */
.skill-list {
  display: flex;
  flex-direction: column;
  gap: 32px;
  margin-bottom: 48px;
}
.skill-item {
  background: $ink-2;
  border: 1px solid rgba($gold, 0.15);
  border-radius: 4px;
  overflow: hidden;
}
.skill-visual {
  padding: 20px 5%;
  display: flex;
  justify-content: center;
  background: radial-gradient(
    ellipse at center,
    rgba($blood, 0.15),
    transparent 70%
  );
  position: relative;
}
.skill-visual img {
  width: 100%;
  max-width: 860px;
  height: auto;
  object-fit: contain;
  position: relative;
  z-index: 1;
}
.skill-info {
  padding: 24px 36px;
  background: rgba($ink-3, 0.8);
  border-top: 1px solid rgba($gold, 0.1);
}
.info-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
.skill-index {
  font-family: "Cinzel", serif;
  font-size: 24px;
  color: $red-lt;
  font-weight: bold;
}
.skill-state {
  padding: 2px 8px;
  background: rgba($gold, 0.2);
  color: $gold-lt;
  font-size: 12px;
  border: 1px solid rgba($gold, 0.4);
  border-radius: 2px;
}
.skill-name {
  margin: 0;
  font-family: $font-title;
  font-size: 24px;
  font-weight: 400;
  color: $paper;
}
.skill-desc {
  margin: 0 0 10px;
  font-size: 16px;
  line-height: 2;
  color: rgba($paper, 0.85);
}
.skill-desc em {
  font-style: normal;
  font-weight: bold;
  color: $gold-lt;
}
.skill-desc .hl {
  color: $red-glow;
  font-weight: bold;
}
.skill-desc--damage {
  display: inline-block;
  margin-top: 6px;
  padding: 4px 12px;
  background: rgba($red, 0.15);
  border-left: 2px solid $red-lt;
  color: $red-glow;
  font-weight: bold;
}

.mechanics-bottom {
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  gap: 40px;
  border-top: 1px solid rgba($gold, 0.1);
  padding-top: 32px;
}
.mode-card {
  display: flex;
  gap: 16px;
  padding: 20px;
  background: rgba($ink, 0.4);
  border: 1px solid rgba($gold, 0.1);
  border-radius: 4px;
  margin-bottom: 12px;
}
.mode-tag {
  flex-shrink: 0;
  height: fit-content;
  padding: 3px 10px;
  background: $red;
  color: #fff;
  font-size: 13px;
  border-radius: 2px;
  font-weight: bold;
}
.mode-tag--gold {
  background: $gold;
  color: $ink;
}
.mode-desc {
  margin: 0;
  font-size: 15px;
  line-height: 1.9;
  color: rgba($paper, 0.85);
}
.mode-desc em {
  font-style: normal;
  color: $gold-lt;
  font-weight: bold;
}

.rotation-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  background: rgba($ink, 0.4);
  padding: 10px 16px;
  border-radius: 4px;
  border: 1px solid rgba($gold, 0.1);
}
.rotation-idx {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  background: $gold;
  color: $ink;
  border-radius: 50%;
  font-weight: bold;
  font-size: 13px;
}
.seq-token {
  display: inline-grid;
  place-items: center;
  min-width: 28px;
  height: 28px;
  padding: 0 8px;
  background: $ink;
  border: 1px solid rgba($gold, 0.4);
  border-radius: 3px;
  font-family: "Cinzel", serif;
  font-weight: bold;
  font-size: 14px;
  color: $paper;
}
.seq-token--key {
  border-color: $red-lt;
  box-shadow: 0 0 10px rgba($red, 0.3);
  color: $red-glow;
}
.seq-token.is-op {
  border: none;
  background: transparent;
  color: rgba($paper, 0.5);
}
.seq-note {
  font-size: 13px;
  color: rgba($paper, 0.6);
  margin-left: 8px;
}
.seq-note--pre {
  margin-left: 0;
  margin-right: 8px;
  padding-right: 8px;
  border-right: 1px dashed rgba($gold, 0.3);
}
.abbrev-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 20px;
  padding-top: 16px;
  border-top: 1px dashed rgba($gold, 0.15);
  margin-top: 16px;
}
.abbrev {
  font-size: 14px;
  color: rgba($paper, 0.7);
  display: flex;
  align-items: center;
  gap: 6px;
}
.abbrev b {
  display: grid;
  place-items: center;
  min-width: 22px;
  height: 22px;
  background: rgba($red, 0.2);
  border: 1px solid rgba($red, 0.4);
  color: $red-glow;
  border-radius: 2px;
  font-family: "Cinzel", serif;
  font-size: 12px;
}

/* ============================================================
   共鸣状况 (档案卷宗)
   ============================================================ */
.report-header-bar {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px 24px;
  background: rgba($ink, 0.6);
  border: 1px solid rgba($red, 0.3);
  border-left: 4px solid $red-lt;
  margin-bottom: 32px;
}
.header-badge {
  padding: 4px 12px;
  background: $red-lt;
  color: $ink;
  font-weight: bold;
  font-size: 14px;
  clip-path: polygon(10% 0, 100% 0, 90% 100%, 0 100%);
}
.header-info {
  display: flex;
  gap: 24px;
  font-size: 15px;
  color: rgba($paper, 0.8);
}
.info-label {
  font-weight: bold;
  color: $paper;
}
.info-label em,
.info-val em {
  font-style: normal;
  color: $red-glow;
  font-weight: bold;
  margin-left: 6px;
}

.report-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}
.report-card {
  position: relative;
  padding: 30px 24px 20px;
  background: rgba($ink-2, 0.8);
  border: 1px solid rgba($gold, 0.2);
  border-radius: 4px;
  box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.5);
}
.report-card--warn {
  border-color: rgba($violet, 0.4);
  background: rgba($ink-2, 0.8);
}
.report-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba($gold, 0.15);
}
.report-tag {
  display: block;
  font-size: 18px;
  font-weight: bold;
  color: $red-glow;
  margin-bottom: 4px;
}
.report-title {
  display: block;
  font-size: 13px;
  color: rgba($gold, 0.6);
}
.report-stamp {
  position: absolute;
  right: 20px;
  top: 20px;
  padding: 4px 10px;
  border: 2px solid rgba($gold, 0.5);
  color: rgba($gold, 0.8);
  font-weight: bold;
  transform: rotate(5deg);
  font-size: 14px;
}
.report-doc {
  padding: 16px;
  background: rgba($ink, 0.5);
  border-left: 2px solid rgba($gold, 0.4);
  margin-bottom: 20px;
}
.doc-ellipsis {
  color: rgba($gold, 0.4);
  margin: 0;
  font-size: 14px;
}
.doc-text {
  font-size: 15px;
  line-height: 2;
  color: rgba($paper, 0.85);
  margin: 8px 0;
}
.doc-text .hl {
  color: $gold-lt;
  font-weight: bold;
}

.report-dialogue {
  padding-left: 16px;
  border-left: 1px dashed rgba($gold, 0.3);
}
.dialogue-line {
  font-size: 15px;
  line-height: 1.9;
  color: rgba($paper, 0.7);
  margin-bottom: 10px;
}
.d-quote {
  color: $gold;
  font-weight: bold;
  font-family: serif;
  font-size: 18px;
}
.dialogue-line--hl {
  color: $gold-lt;
  background: rgba($blood, 0.15);
  padding: 8px;
  border-radius: 2px;
  margin-top: 12px;
}
.dialogue-line--hl em {
  font-style: normal;
  color: $red-glow;
  font-weight: bold;
}

.report-foot {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
}
.foot-line {
  flex: 1;
  height: 1px;
  background: rgba($gold, 0.2);
}
.foot-text {
  font-size: 12px;
  color: rgba($gold, 0.5);
}

/* ============================================================
   专武
   ============================================================ */
.weapon-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 40px;
  margin-bottom: 32px;
}
.weapon-visual {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba($ink, 0.5);
  border: 1px solid rgba($gold, 0.15);
  border-radius: 4px;
  padding: 30px;
}
.weapon-img-box img {
  width: 100%;
  max-width: 200px;
}
.weapon-plate {
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 16px;
  background: rgba($gold, 0.1);
  border-top: 1px solid rgba($gold, 0.3);
  border-bottom: 1px solid rgba($gold, 0.3);
}
.plate-text {
  font-size: 15px;
  font-weight: bold;
  color: $gold-lt;
  letter-spacing: 0.2em;
}
.plate-mark {
  color: $red-lt;
  font-size: 12px;
}

.weapon-meta {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.weapon-name-row {
  display: flex;
  align-items: baseline;
  gap: 16px;
  margin-bottom: 12px;
}
.weapon-name-row h3 {
  margin: 0;
  font-family: $font-title;
  font-size: 36px;
  font-weight: 400;
  color: $paper;
}
.weapon-type {
  font-size: 14px;
  color: $red-glow;
  border: 1px solid rgba($red, 0.4);
  padding: 2px 8px;
  border-radius: 2px;
}
.weapon-verse {
  margin: 0 0 24px;
  padding-left: 12px;
  border-left: 2px solid $gold;
  font-size: 16px;
  color: rgba($paper, 0.85);
  font-style: italic;
}
.weapon-passive {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba($gold, 0.2);
  margin-bottom: 16px;
}
.passive-name {
  font-size: 18px;
  font-weight: bold;
  color: $gold-lt;
}
.passive-en {
  font-size: 12px;
  color: rgba($gold, 0.5);
  margin-left: 8px;
  letter-spacing: 0.2em;
}
.passive-steps {
  display: flex;
  gap: 6px;
  align-items: center;
}
.step {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  background: rgba($gold, 0.2);
  border: 1px solid rgba($gold, 0.5);
  border-radius: 2px;
  font-family: "Cinzel", serif;
  font-size: 13px;
  font-weight: bold;
  color: $gold-lt;
}
.step-label {
  font-size: 13px;
  color: rgba($paper, 0.6);
}

.buff-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.buff-item {
  display: flex;
  gap: 12px;
}
.buff-dot {
  flex-shrink: 0;
  width: 6px;
  height: 6px;
  background: $red-lt;
  border-radius: 50%;
  margin-top: 10px;
  box-shadow: 0 0 6px $red-lt;
}
.buff-content {
  font-size: 15px;
  line-height: 1.95;
  color: rgba($paper, 0.85);
}
.buff-content b {
  color: $gold-lt;
  font-weight: bold;
}
.tag {
  padding: 0 4px;
  border-radius: 2px;
  font-weight: bold;
  font-size: 14px;
}
.tag--jinian {
  color: $gold-lt;
  background: rgba($gold, 0.15);
  border: 1px solid rgba($gold, 0.4);
}
.tag--channian {
  color: $violet-lt;
  background: rgba($violet, 0.15);
  border: 1px solid rgba($violet, 0.4);
}

.weapon-lore {
  padding: 24px;
  background: rgba($ink, 0.4);
  border: 1px solid rgba($gold, 0.15);
  text-align: center;
  border-radius: 4px;
}
.lore-body p {
  margin: 0;
  font-size: 16px;
  line-height: 2.1;
  color: rgba($paper, 0.8);
}
.lore-em {
  margin-top: 8px;
  font-weight: bold;
  color: $gold-lt;
  text-shadow: 0 0 10px rgba($gold, 0.4);
}

/* ============================================================
   珍物
   ============================================================ */
.treasure-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 40px;
  align-items: center;
}
.treasure-layout.reverse {
  grid-template-columns: 1fr 320px;
}
.treasure-layout.reverse .treasure-img {
  order: 2;
}
.treasure-layout.reverse .treasure-text {
  order: 1;
}
.treasure-img {
  position: relative;
  padding: 24px;
  background: rgba($ink-2, 0.8);
  border: 1px solid rgba($gold, 0.2);
  border-radius: 4px;
  text-align: center;
}
.treasure-img img {
  width: 100%;
  max-width: 240px;
  margin: 0 auto;
}
.treasure-text p {
  margin: 0 0 16px;
  font-size: 16px;
  line-height: 2.1;
  color: rgba($paper, 0.85);
}
.treasure-text strong {
  color: $gold-lt;
  font-weight: bold;
}
.treasure-em {
  color: $gold-lt;
  font-weight: bold;
}
.treasure-highlight {
  padding: 16px;
  background: rgba($blood, 0.15);
  border-left: 2px solid $red-lt;
  border-radius: 2px;
  margin-top: 24px;
}

.food-effect {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: rgba($gold, 0.08);
  border: 1px solid rgba($gold, 0.3);
  border-radius: 4px;
  margin-bottom: 20px;
}
.effect-icon {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  background: rgba($gold, 0.2);
  border-radius: 50%;
  color: $gold-lt;
  font-size: 20px;
}
.effect-label {
  display: block;
  font-size: 13px;
  font-weight: bold;
  color: $gold;
  margin-bottom: 4px;
}
.effect-text p {
  margin: 0;
  font-size: 15px;
  line-height: 1.7;
  color: rgba($paper, 0.9);
}
.effect-text strong {
  color: $gold-lt;
  font-family: "Cinzel", serif;
  font-size: 16px;
}

/* ============================================================
   共鸣链 (卡片网格)
   ============================================================ */
.chain-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.chain-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px;
  background: rgba($ink-2, 0.7);
  border: 1px solid rgba($gold, 0.15);
  border-radius: 4px;
  transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba($red-lt, 0.4);
    box-shadow: 0 8px 24px -8px rgba($red, 0.3);
  }
  &.is-key {
    border-color: rgba($red, 0.35);
    background: linear-gradient(180deg, rgba($blood, 0.1), rgba($ink-2, 0.7));
  }
}

.chain-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px dashed rgba($gold, 0.2);
}
.chain-num {
  font-family: "Cinzel", serif;
  font-size: 24px;
  font-weight: 700;
  color: rgba($gold, 0.5);
}
.chain-card.is-key .chain-num {
  color: $red-lt;
  text-shadow: 0 0 10px rgba($red, 0.5);
}
.chain-name {
  margin: 0;
  font-family: $font-title;
  font-size: 22px;
  font-weight: 400;
  color: $paper;
}

.chain-desc p {
  margin: 0 0 10px;
  font-size: 15px;
  line-height: 1.9;
  color: rgba($paper, 0.85);
}
.chain-desc p:last-child {
  margin-bottom: 0;
}
.chain-desc .sub-desc {
  font-size: 14px;
  color: rgba($paper, 0.65);
  padding-left: 10px;
  border-left: 1px solid rgba($paper, 0.3);
}

.num-hl {
  color: $gold-lt;
  font-weight: bold;
  font-family: "Cinzel", serif;
  font-size: 16px;
  margin: 0 2px;
  &--big {
    font-size: 20px;
    color: $red-glow;
    text-shadow: 0 0 10px rgba($red, 0.4);
  }
}

/* ============================================================
   角色故事
   ============================================================ */
.story-title {
  font-family: $font-title;
  font-size: 28px;
  font-weight: 400;
  color: $gold-lt;
  margin: 0;
}
.story-num {
  font-size: 14px;
  color: rgba($paper, 0.5);
  border: 1px solid rgba($paper, 0.2);
  padding: 2px 8px;
  border-radius: 2px;
}
.story-text {
  margin-top: 24px;
  font-size: 16px;
  line-height: 2.3;
  color: rgba($paper, 0.85);
  white-space: pre-wrap;
}
.story-nav {
  display: flex;
  justify-content: space-between;
  margin-top: 32px;
  padding-top: 20px;
  border-top: 1px solid rgba($gold, 0.2);
}
.story-nav button {
  background: rgba($ink, 0.5);
  border: 1px solid rgba($gold, 0.3);
  color: $gold-lt;
  padding: 8px 24px;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.2s;
}
.story-nav button:hover {
  background: rgba($gold, 0.1);
  border-color: $gold;
}

/* ============================================================
   Q版小人
   ============================================================ */
.floating-chibis {
  position: fixed;
  inset: 0;
  z-index: 50;
  pointer-events: none;
}
.chibi-img {
  position: absolute;
  width: 100px;
  height: 100px;
  object-fit: contain;
  pointer-events: auto;
  cursor: pointer;
  filter: drop-shadow(0 8px 18px rgba($red, 0.4));
}

/* ============================================================
   响应式
   ============================================================ */
@media (max-width: 960px) {
  .hero {
    grid-template-columns: 1fr;
    text-align: center;
  }
  .hero-note {
    position: static;
    display: block;
    margin: 20px auto 0;
    max-width: 260px;
    text-align: left;
    transform: rotate(-1.4deg);
  }
  .hero__portrait {
    max-width: 320px;
    margin: 0 auto;
  }
  .meta-vertical {
    display: none;
  }
  .meta-eyebrow {
    justify-content: center;
  }
  .meta-name {
    justify-content: center;
  }
  .meta-rule {
    margin: 24px auto;
  }
  .meta-cv {
    justify-content: center;
  }

  .mechanics-bottom {
    grid-template-columns: 1fr;
  }
  .report-grid {
    grid-template-columns: 1fr;
  }
  .weapon-layout {
    grid-template-columns: 1fr;
  }
  .weapon-visual {
    max-width: 320px;
    margin: 0 auto;
  }
  .treasure-layout,
  .treasure-layout.reverse {
    grid-template-columns: 1fr;
    text-align: center;
  }
  .treasure-layout.reverse .treasure-img {
    order: 0;
  }
  .treasure-layout.reverse .treasure-text {
    order: 0;
  }
  .chain-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .panel {
    padding: 24px 20px;
  }
  .head-title h2 {
    font-size: 26px;
  }
  .lore-card {
    flex-direction: column;
    gap: 12px;
  }
  .lore-card-num {
    font-size: 28px;
  }
  .skill-info {
    padding: 16px;
  }
  .weapon-name-row h3 {
    font-size: 28px;
  }
  .name-cn {
    font-size: 56px;
  }
}
</style>
