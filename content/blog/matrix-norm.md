---
title: "矩阵范数"
date: "2026-02-16"
tags: ["数学基础", "线性代数", "矩阵范数"]
abstract: "矩阵 2-范数与 Frobenius 范数的定义、几何与能量解释，以及它们之间的不等式关系。"
draft: false
---

## 1. 定义

### 1.1 矩阵2-范数
矩阵2-范数是由向量欧几里得范数诱导的**算子范数**：
$$
\|A\|_2 = 
\max _{x \neq 0} \frac{\|Ax\| _2}{\|x\| _2} = 
\max _{\|x\| _2 = 1} \|Ax\| _2
$$
等价刻画：
$$
\|A\|_2 = \sigma _{\max}(A)
= \sqrt{\lambda _{\max}(A^\top A)}
$$
特殊情况：
- 若 $A$ 是实对称矩阵（或埃尔米特矩阵）：$\|A\|_2 = \max_i |\lambda_i(A)|$

> **证明：**
>
> 根据定义，矩阵2-范数是由向量欧几里得范数诱导的算子范数：$$\|A\|_2=\max _{\|x\|_2=1}\|Ax\|_2$$
> 两边平方：
> $$\|A\| _2^2=\max _{\|x\|_2=1}\|Ax\|_2^2=\max _{\|x\|_2=1}(Ax)^\top(Ax)=\max _{\|x\|_2=1}x^\top A^\top Ax$$
> 矩阵 $A^\top A$ 满足：对称、半正定。对于任意对称矩阵 $M$，**瑞利-里兹定理** 表明：
> $$\max _{\|x\|_2=1}x^TMx=\lambda _{max}(M)$$
> 由此可直接得出结论。

#### 1.1.1 瑞利商定理

设
$$
A \in \mathbb{R}^{n\times n}
$$
为**实对称矩阵**。
将其特征值（计重数）记为
$$
\lambda_1 \le \lambda_2 \le \cdots \le \lambda_n,
$$
$\{ u_1,\dots,u_n \}$ 为标准正交特征基。
定义瑞利商
$$
R_A(x) = \frac{x^\top A x}{x^\top x}, \qquad x \neq 0
$$
则
$$
\min _{\| x \|_2 = 1} R = \lambda_1,\quad \max _{\| x \|_2 = 1} R = \lambda_n
$$
即对任意 $x$，瑞利商满足：$R(A,x) \in [\lambda _{min},\lambda _{max}]$。

**证明**
设 $x \in \mathbb{R}^n$ 且 $\|x\| _2 = 1$，将 $x$ 在标准正交特征基下展开：
$$
x = \sum _{i=1}^n c_i u_i,
\qquad
\sum _{i=1}^n c_i^2 = 1
$$
则
$$
\begin{aligned}
x^\top A x=\left(\sum _{i=1}^{n}c_iu_i^T\right)\left(\sum _{i=1}^{n}c_iAu_i\right)
=\left(\sum _{i=1}^{n}c_iu_i^T\right)\left(\sum _{i=1}^{n}c_i\lambda _i u _i\right)
=\sum _{i=1}^n \lambda_i c_i^2
\end{aligned}
$$
由 $\lambda_1 \le \lambda_i \le \lambda_n$，得
$$
\lambda_1 \sum_i c_i^2
\le
\sum_i \lambda_i c_i^2
\le
\lambda_n \sum_i c_i^2.
$$
结合 $\sum_i c_i^2 = 1$，可得
$$
\lambda_1 \le x^\top A x \le \lambda_n.
$$
下界在 $x = u _1$ 处取到，上界在 $x = u_n$ 处取到。

#### 1.1.2 几何解释

矩阵将单位球面映射为椭球面（球面与椭球面代表两个集合，球面到椭球面的映射表示构成球面的集合中任意元素都会被映射到构成椭球面的集合中）。$\|A\| _2$ 是该椭球面**最长半轴**的长度，代表向量**最大可能的放大倍数**。
**理解：** 矩阵2-范数是**最坏方向上的拉伸程度**。

#### 1.1.3 能量解释
从能量角度，**二次型**
$$
E(x) := \|Ax\| _2^2 = x^\top A^\top A x
$$
可解释为算子 $A$ 作用于输入状态 $x$ 时**诱导的能量**。

### 1.2 F范数
F范数定义为
$$
\|A\|_F = \sqrt{\sum _{i,j} |a _{ij}|^2} = \sqrt{\mathrm{tr}(A^\top A)}
$$
等价的谱形式：
$$
\|A\|_F = \sqrt{\sum _{k=1}^{\min(m,n)} \sigma_k(A)^2}
$$
其中假设 $A \in \mathbb{R}^{m \times n}$。矩阵 $A$ 的奇异值个数为 $\text{min}(m,n)$，这是因为 $\text{Rank}(A) \leq \text{min}(m,n)$。

>证明：
> 根据定义，矩阵 $A$ 的F-范数满足 $\|A\|_F^2=\operatorname{Tr}(A^TA)$。对 $A$ 做奇异值分解：$$A^TA=(U\Sigma V^T)^T(U\Sigma V^T)=V\Sigma^T\Sigma V^T$$
> 则：$\text{Tr}(A^TA)=\text{Tr}(V\Sigma^T\Sigma V^T)=\text{Tr}(\Sigma^T\Sigma)=\text{Tr}(\text{diag}(\sigma_1^2,\sigma_2^2,\cdots))=\sum_i \sigma_i^2$

**几何解释：**
将矩阵 $A$ 视为 $\mathbb{R}^{mn}$ 中的向量，$\|A\|_F$ 是其欧几里得长度。它衡量矩阵的**总能量**。
**理解：** 全局/平均幅值，对方向不敏感。

## 2. 性质
> **矩阵范数公理：**
> 两种范数均满足矩阵范数的基本公理：
>
> - 正定性：$\|A\| \ge 0$，且 $\|A\| = 0 \iff A = 0$
> - 齐次性：$\|\alpha A\| = |\alpha| \|A\|$
> - 三角不等式：$\|A + B\| \le \|A\| + \|B\|$
> **次乘性：**
>
> - **2-范数**
> $$\|AB\|_2 \le \|A\|_2 \|B\|_2$$
> - **弗罗贝尼乌斯范数**
> $$\|AB\|_F \le \|A\|_2 \|B\|_F,\qquad\|AB\|_F \le \|A\|_F \|B\|_2$$
> 一般情况下，
> $$\|AB\|_F \le \|A\|_F \|B\|_F$$
> **不成立**。
> **正交/酉不变性**
>
> 对任意正交（或酉）矩阵 $U, V$：
> $$\|U A V\|_2 = \|A\|_2,\qquad\|U A V\|_F = \|A\|_F$$

## 3. 2-范数与F的关系
设 $r = \mathrm{rank}(A)$，则：
$$
\boxed{\|A\|_2 \le \|A\|_F \le \sqrt{r} \|A\|_2}
$$
该不等式直接由奇异值分解推导得出：
$$
\|A\|_2 = \max_i \sigma_i,
\qquad
\|A\|_F = \sqrt{\sum_i \sigma_i^2} 
$$

### 特殊情况
- **秩1矩阵**
$$
\|A\|_F = \|A\|_2 
$$
- **高秩矩阵**
$$
\|A\|_F \gg \|A\|_2
\quad\text{(能量分散在多个模式中)}
$$
