---
title: "AI 作为未来科学"
date: "2026-07-22"
tags: ["人工智能", "科学哲学"]
abstract: "罗军老师讲座笔记：从局部性问题、具身第一性原理到深度学习为何有效的六个基本问题。"
draft: false
---

本文是 2026 年 7 月 21 日 Openmind 罗军老师在 SII 的讲座笔记，深受启发，在此共勉。

# Some Basic Questions of AI

现在的 AI 还不是科学，更像是一种 Current Alchemy。就像 Newton 被称为"最后一个炼金术师"，今天的 AI 研究也处在一种工程、哲学和科学尚未完全分化的状态中。

一个最基本的问题是：Why do we want to do AI research?

Presenter's answer: love the world.

如果 having a mind == having a world，那么 mind 也意味着一种 ability to love the world。由此可以区分两种 AI 的意义：

> AI as science => understanding the mind  
> AI as engineering => constructing minds

## Q1: If intelligence is the solution, what is the problem?

The presenter's answer:

> In the big world, what an agent cares about is there and then, but what the agent can act on is here and now.

这就是局部性问题。例如图灵机、物理系统、具身智能体都必须在"此时此地"行动，但它们关心的对象往往在"彼时彼地"。

因此，一个相关的问题是：why does intelligence need wires?

关键在于缩短线路，保护按 $1/r^2$ 衰减的信号不被淹没，尽可能拉近"彼时彼地"和"此时此地"。

> "寻址"：虚拟的"连线"  
> "存储"：跨时间的"连线"

从这个角度看，强化学习可以被理解为一种 learning to time travel：通过学习价值预测，让系统能够在当下行动时考虑未来结果。

但这也引出另一个问题：why do agents need representations?

实际的系统一定存在于时间之中。一个 agent 要在 here and now 行动，却关心 there and then，就不能停留在最基本的物质层面，因为基本物质层面缺乏可重复、可稳定调用的结构。因此，表征的作用就是在时间中建立可以重复使用的结构。

AI 还不是科学的根本原因，也许在于我们缺乏一种数学语言，能够描述时间延续层面的空间结构的一致表征。也就是说，在一个丰富广阔的世界里，系统需要以恰当的抽象来应对物理上的分离。

这里还涉及规范性：对自己和他者提出要求。一个系统不仅要感知和运动，还要对自己以及外在世界负责任。但这个"责任"的概念，目前还没有清晰的数学语言来描述。

于是问题变成：什么是正确的学习？

AI 的发展也许可以被看作这样一条路径：

> Passive AI（工具性 AI）  
> -> Interactive AI（互动性 AI）  
> -> Proactive AI  (主动性AI，有好奇心，会主观地改造环境)
> -> Normative AI  (规范性AI，具身性出现，对自己和他人负责)
> -> Objective AI（客观性 AI，相当于人类历史发展到轴心时代）

问题意识非常重要。如果从 2026 到 2062 的 36 年里，我们都只是在完善大语言模型，那么 so?

## Q2: 具身如何是人工智能里的第一性原理？

因为计算机里面没有数，只有数字；只有符号，没有符号之间的关系。

进一步说：

因为计算机里面没有数字，只有比特。  
因为计算机里面没有比特，只有稳定的高低电压。  
因为计算机里面没有稳定的高低电压，只有不断变化的电磁场。

也就是说，计算机并没有真正对自己的结构负责。

Mind is embodied and embedded. 身体和大脑都嵌入在真实世界中。只有当计算系统开始对自身与真实世界的嵌入方式负责时，才真正谈得上具身。

因此，RL 架构的具身化，要求逻辑抽象接口必须与实际真实世界相嵌入。

所谓第一性，也许可以表达为：

> 成功 => 无标定的机器人系统

现今的机器人高度依赖人类提供的时间和空间坐标系标定。而具身，可能正是未来 AI 科学的基础架构。

## Q3: 深度学习为何有效？

心智是系统与世界之间的关系。压缩数据当然有用，但它无法回答系统与世界之间的关系问题。

深度学习是一种分布式表征，但当前理论仍然弱小。为什么深度学习的理论迟迟没有真正建立起来？也许过去 300 到 400 年的某些数学思想本身就存在局限。

可能的方向有两个：

1. adaptive temporal abstraction as core of agency（能动性的来源）
2. 相位化协调作为感知运动能力的核心

其中一个挑战是：用细胞集群的相位序列来表征和计算。例如，一个"起身"的动作，可能是由大量神经元之间的时间差来完成表征和计算，而不是像计算机那样依赖主频时间步来计算。

Hopfield 和 Hinton 也许并没有完成他们真正想要完成的事情。更值得关注的方向可能是：

> event computing (事件计算) as emphasized coordination

这里还有一个问题：分布是学习的结果吗？信息论是否已经预设了分布？

## Q4: 抽象结构的主要源泉是什么？

Direction: 社会文化环境才是抽象结构的主要来源。

挑战是：demonstrate that "reward is enough" only if the society is wise enough.

也就是说，reward 是否足够，取决于 reward 所嵌入的社会文化环境是否足够智慧。

## Q5: 什么重要，什么是我们？

Direction: 我们作为世界的一部分，从世界之中发现什么是重要的。

挑战在于：如何规范性地成就我们大家，使我们成为在世间的爱世界者。

所谓爱世界，也许不是抽象地爱一个外部对象，而是爱到 TA 的世界层。

## Q6: 我们需要什么样的数学？

Occurrence 很重要。

也许我们需要一种能够描述 occurrence、num-occurrence、时间结构和感知运动过程的数学。

脉冲神经网络和 Topos 理论可能是一个方向。
