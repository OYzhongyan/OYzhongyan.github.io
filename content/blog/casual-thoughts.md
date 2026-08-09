---
title: "碎碎念"
date: "2026-08-02"
tags: ["随笔", "智能", "控制论"]
abstract: "关于智能、目标、观察与二阶控制论的零散思考。"
draft: false
---

## 智能与自创生

**Humberto Maturana**（1928–2021）与 **Francisco Varela** 提出 **autopoiesis（自创生）** 理论：生命系统是自我生成的系统——"系统产生自己的组成部分"。

数学抽象：一个系统 $S$ 具有一个生成过程 $F$ 使得 $F(S)=S$，或 $S\_{t+1}=F(S\_t)$。

## 二阶控制论

**Heinz von Foerster**（1911–2002）提出 **Second-order cybernetics（二阶控制论）**。控制论（Norbert Wiener）的核心问题是"系统如何通过反馈实现控制"：

- 一阶控制论：研究被观察的系统如何控制自己
- 二阶控制论：观察者是系统的一部分，**研究观察系统的系统**

## 庄子的混沌

> 《庄子·应帝王》
> 南海之帝为儵，北海之帝为忽，中央之帝为混沌。儵与忽时相与遇于混沌之地，混沌待之甚善。儵与忽谋报混沌之德，曰："人皆有七窍，以视听食息，此独无有，尝试凿之。"日凿一窍，七日而混沌死。

庄子的讽刺：试图用人的结构改造非人的存在，反而破坏了它原本的状态。

关于智能的隐喻：一个物理系统（混沌）出现自我观察，开始区分自身与环境，建立自身模型（混沌开窍），然后评价不同状态，产生目标——旧有自组织结构随之死亡。

## 智能与目标

**Richard S. Sutton** 在 *John McCarthy's Definition of Intelligence*（2019）中讨论：

1997 年 John McCarthy 认为 **智能是实现目标的计算能力**——*Intelligence is the computational part of the ability to achieve goals in the world.* 定义清晰，但不形式化。

**究竟什么是"拥有目标"？** 如何判断一个系统真的有目标，而不是看起来有？Sutton 的关键洞察：

> A system having a goal or not, despite the language, is not really a property of the system at all. **It is a property of the relationship between the system and an observer.** It is a 'stance' that the observer takes with respect to the system (Dennett, 1989).

即"目标"不是系统自身的属性，而是系统与观察者之间关系的属性——观察者为预测或控制系统而采取的一种姿态。

Sutton 没有在这篇文章中说清楚的是：**什么是观察？** 观察系统本身也可以被作为观察的对象——这正是二阶控制论的立场。

由此引出两种观点：

- 观点 1：智能是系统的内部属性
- 观点 2：智能是观察者赋予的解释

## 一些散点

**关于 loss 与智能**：一旦定义了 loss function，使命就被限制在特定领域，领域知识通过网络结构注入，这就是归纳偏置（inductive bias）。或许真正的智能不需要 loss function；梯度下降也未必是网络被优化的根本机制——那样只是把智能定义为优化问题。

反过来说，没有梯度下降很难训练大规模网络，例如在SNN中的STDP方法的信号太局部，很难捕捉某个参数变化对全局的影响。

真正的智能可能源于输入信息的**时间结构**：不预设任何"词""动作""奖励"。重要的不是词本身，而是 **映射到它（map-to，表征）** 与 **从它映射出去（from-it，注意力）** 的过程。

> 词是离散的，词义是连续的。

**好奇心**：当智能体没有明确的奖励和目标时，主动改变自己状态的过程。

**自指问题**：一个自指系统能否观察自己？观察的形式定义是什么？

***

一个系统如果要完全自修改，必须有一种机制让有限数量的动态变量生成大量结构变量。一个能修改自己的神经网络，可以被一个足够大的 RNN / memory network 模拟。
