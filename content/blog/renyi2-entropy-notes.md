---
title: "Renyi-2 熵与张量网络：一笔记记"
date: "2026-07-05"
tags: ["量子物理", "张量网络", "Renyi 熵", "笔记"]
abstract: "记录 Renyi-2 熵的定义、张量网络计算中的关键技巧，以及一些容易混淆的点。"
draft: false
---

## 定义回顾

对于一个量子态 $\rho$，其 $n$ 阶 Renyi 熵定义为

$$
S_n(\rho) = \frac{1}{1-n} \, \mathrm{tr}\left( \rho^n \right).
$$

特别地，**Renyi-2 熵**（即 $n=2$）

$$
S_2(\rho) = -\log \mathrm{tr}(\rho^2),
$$

正比于所谓的**纯度**（purity）$\mathrm{tr}(\rho^2)$ 的负对数。在归一化条件下 $\mathrm{tr}\,\rho = 1$，有 $0 \leq S_2 \leq \log d$（$d$ 为希尔伯特空间维数）。

## 缩并技巧：replica trick

张量网络计算 $S_2$ 的标准方法是 **replica trick**：把 $\mathrm{tr}(\rho^2)$ 写成两份 $\rho$ 的缩并

$$
\mathrm{tr}(\rho^2) = \sum_{ij} \rho_{ij} \, \rho_{ji}.
$$

形象地说，就是把表示 $\rho$ 的张量网络复制一份，并按"反向"指标连接两个拷贝。这种"双层"结构在 MPS / PEPS 计算中是标准操作。

## 为什么要 $n=2$ 而不是 $n=1$？

纠缠熵（即 $n \to 1$ 极限的 von Neumann 熵）原则上更"物理"，但其数值计算需要解析延拓 $n \to 1$，对误差极敏感。相比之下，$S_2$ 是**整数阶**的，直接对应两次复制，张量网络计算干净利落，常用作基准量。

> 经验法则：先用 $S_2$ 快速验证物理结论的方向，再用纠缠熵做最终定量。

## 一个常见误区

不要混淆 $\rho_A$ 与约化密度矩阵 $\rho_A = \mathrm{tr}_B |\psi\rangle\langle\psi|$。当我们说 "$S_2(A)$" 时，默认已对子系统 $A$ 做了部分迹：

$$
S_2(A) = -\log \mathrm{tr}\left( \rho_A^2 \right).
$$

对于纯态 $|\psi\rangle$，有 $S_2(A) = S_2(B)$，但 $S_n(A)$ 在 $n \neq n'$ 时一般不相等。

## 小结

- $S_2$ 计算上友好，物理上等价于纯度的对数
- 张量网络中用 replica trick 做"双层缩并"
- 与纠缠熵不同，$S_2$ 不需要解析延拓，是数值验证的优选
