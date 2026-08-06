---
title: "核函数——从经典理论到注意力机制"
date: "2026-01-23"
tags: ["机器学习", "核函数", "注意力机制"]
abstract: "从核函数的基础定义出发，梳理再生核希尔伯特空间理论，并延伸到 Transformer 注意力机制中的核函数视角。"
draft: false
---

## 1. 核函数简介
什么是核函数？在本节中，我们将建立对核函数的基础直观认知。核函数 $\kappa$ 是一个双线性映射：$\mathcal{X},\mathcal{Y} \longmapsto \mathbb{R}$。它可以被视作高维特征空间中的距离度量，在该空间中，非线性问题能够转化为线性问题。对于给定的核函数 $\kappa$，通常存在与之对应的特征映射 $\phi: \mathcal{X} \longmapsto \mathcal{F} _{\mathcal{X}}$，其中 $\mathcal{F} _{\mathcal{X}}$ 通常是维度高于 $\mathcal{X}$ 的向量空间，被称为**特征空间**。特征映射既可以设计为固定静态的形式，也可以通过神经网络实现可学习、动态的映射。我们来看一个例子：
假设原始空间为 $\mathbb{R}^2$，所有满足 $\frac{x_1^2}{a^2}+\frac{x_2^2}{b^2}<1$ 的样本被划分为类别1，其余样本划分为类别2。显然，划分两个类别的边界是非线性的。但是，如果我们构造特征映射 $\phi: \mathbb{R}^2 \rightarrow \mathbb{R}^3: (x_1, x_2) \longmapsto (z_1,z_2,z_3)=(x^2_1,\sqrt 2 x_1 x_2,x_2^2)$，会发现椭圆边界变为：$\frac{1}{a^2}z_1+0\cdot z_2+\frac{1}{a^2}z_3=1$，这是 $\mathbb{R}^3$ 空间中的一个线性子空间。

考虑两个样本在特征空间中的内积：

$$
\langle\phi(x_1,x_2), \phi'(x'_1,x'_2)\rangle = \langle (z_1,z_2,z_3),(z'_1,z_2',z'_3)\rangle = (x_1x'_1+x_2x_2')^2 = (\langle x, x'\rangle)^2:=\kappa(x,x')
$$

对于两个样本 $x,x'$，内积 $\langle x, x' \rangle$ 描述了它们在原始空间中的相似度，而核函数 $\kappa(x,x')$ 描述了它们在高维特征空间中的相似度。自然地，内积是一类特殊的核函数。如果我们拥有数据集：$\lbrace x^{(1)},x^{(2)},\dots,x^{(n)}\rbrace $，可以构造一个矩阵，其中每个元素表示任意两个数据的相似度。矩阵的第 $i$ 行第 $j$ 列元素为 $\kappa(x^{(i)},x^{(j)})$，我们将这个矩阵称为**核矩阵**。在很多场景下，我们无需知道特征映射函数 $\phi$，仅通过核函数就能完成相关变换。这一思想被称为**核技巧**。常见的核函数包括：

$$
\kappa(x,x')=\exp\left(\frac{-\|x-x'\|^2}{2\sigma^2}\right)
$$

这就是高斯核。可以看到，它是一个满足 $\mathcal{X}\times\mathcal{X} \longmapsto \mathbb{R}$ 的映射，其中 $x,x' \in \mathcal{X}$。

## 2. 再生核
接下来我们深入学习核函数的数学理论。在上一节中，我们了解了特征映射与核函数如何将非线性问题转化为线性问题。

> **定义**：函数 $\kappa$ 是**正定核函数**，当且仅当存在特征映射 $\phi$，将输入空间 $\mathcal{X}$ 映射到某个希尔伯特空间 $\mathcal{H}$，使得：$$\kappa(x,y)=\langle \phi(x),\phi(y)\rangle _{\mathcal{H}}, \forall x,y \in \mathcal{X}$$

该定义存在一个等价形式：

> **定义**：设集合 $X$ 为非空集合，函数 $\kappa: X \times X \mapsto \mathbb{R}$ 是**正定核函数**，若对于任意 $n \in \mathbb{N}$，任意 $x_1, x_2, \ldots, x_n \in X$，以及任意实数 $c_1,c_2,\ldots,c_n \in \mathbb{R}$，都满足：$$\sum_{i=1}^n\sum_{j=1}^nc_ic_j\kappa(x_i,x_j)\geq 0$$即核矩阵（Gram矩阵）$K$ 是半正定的，其中 $K_{ij}=\kappa(x_i,x_j)$$

正定核的核心性质：
- **对称性**：
  对于实值核：
$$
k(x, y) = k(y, x), \quad \forall x, y \in X
$$
- **运算封闭性**：
  若 $k_1$ 和 $k_2$ 为正定核，则正定核在以下运算下保持封闭：
  - 非负线性组合：
$$
  k(x, y) = \alpha k_1(x, y) + \beta k_2(x, y) \quad (\alpha, \beta \geq 0)
$$
  - 乘积：
$$
  k(x, y) = k_1(x, y) \cdot k_2(x, y)
  $$
  - 函数复合（满足特定约束）：
  $$
  k(x, y) = f(k_1(x, y))
  $$
其中 $f$ 是泰勒展开系数非负的整函数（在整个复平面上解析）。
  - 逐点极限：
    正定核序列的逐点极限仍为正定核。
- **与再生核希尔伯特空间（RKHS）的关联**：
  根据**Moore-Aronszajn定理**，每个正定核都能唯一确定一个再生核希尔伯特空间 $\mathcal{H}_k$。

  > **Moore-Aronszajn定理**
  > 任意正定核函数 $k(x, y)$ 都对应**唯一的再生核希尔伯特空间**，反之亦然。
  >
  > - 因此，正定核函数一定是某个再生核希尔伯特空间的再生核。
  > - 对于正定核函数 $k$，样本 $x$ 对应的映射向量 $\phi(x)$ **不唯一**。即在不同的正交基空间中，$\phi(x)$ 在不同基下的坐标不一致。当 $\phi(x) = k(\cdot, x)$ 时，$\phi(x)$ 被称为 $x$ 的**标准映射向量**。
  > - $\phi(x)$ 是无限维向量，无法直接计算其具体数值。因此我们采用**核技巧**来避免直接处理 $\phi(x)$。

 在该再生核希尔伯特空间中：
  - 核函数满足**再生性**：
$$
  f(x) = \langle f, k(\cdot, x) \rangle _{\mathcal{H}_k}, \quad \forall f \in \mathcal{H}_k, \forall x \in X
  $$
  - 核函数可表示为：
  $$
  k(x, y) = \langle k(\cdot, x), k(\cdot, y) \rangle _{\mathcal{H}_k}
  $$
**注**：这意味着所有正定核都是某个再生核希尔伯特空间的再生核，反之，任意再生核希尔伯特空间的再生核都是正定核。

### 2.1 再生核希尔伯特空间（RKHS）
**再生核希尔伯特空间（RKHS）** 是核方法的数学基础，它将核函数与函数空间结构相连接，为支持向量机（SVM）、高斯过程等机器学习方法提供了理论支撑。

#### 2.1.1. 再生核希尔伯特空间的定义1
设 $H$ 是由函数 $f : X \mapsto \mathbb{K}$ 构成的希尔伯特空间（完备内积空间）。若存在函数 $k : X \times X \mapsto \mathbb{R}$ 满足：

- $\forall x \in X, \; k(\cdot, x) \in H$
- $\forall x \in X, \; \forall f \in H, \; f(x) = \langle f, k(\cdot, x) \rangle_H$
  即函数 $f$ 在点 $x$ 处的取值等于 $f$ 与核函数 $k(\cdot, x)$ 的内积。该性质被称为**再生性**（重构性）。
- 特别地，对于 $\forall x, y \in X$，有：
  $$
  k(x, y) = \langle k(\cdot, x), k(\cdot, y) \rangle_H
  $$

则称 $k$ 为 $H$ 的**再生核**，称 $H$ 为**再生核希尔伯特空间（RKHS）**。

**注**：再生核希尔伯特空间是希尔伯特空间，但希尔伯特空间不一定是再生核希尔伯特空间。接下来我们讨论何种希尔伯特空间属于再生核希尔伯特空间。

#### 2.1.2. 赋值泛函
设 $H$ 是定义在非空集合 $X$ 上、由函数 $f : X \mapsto \mathbb{K}$ 构成的希尔伯特函数空间。对于固定的 $x \in X$，定义映射 $\delta_x : H \mapsto \mathbb{K}$ 满足 $\delta_x f = f(x)$，则 $\delta_x$ 被称为点 $x$ 处的**赋值泛函**。

赋值泛函是**线性泛函**。

#### 2.1.3. 再生核希尔伯特空间的定义2
$H$ 是再生核希尔伯特空间，当且仅当对于所有 $x \in X$，赋值泛函 $\delta_x$ 都是**有界**的，即存在常数 $\lambda_x \geq 0$（与 $x$ 相关），使得对所有 $f \in H$：
$$
|f(x)| = |\delta_x f| \leq \lambda_x \|f\|_H
$$

#### 2.1.4. 定理（Riesz表示定理）
在希尔伯特空间 $H$ 中，对于任意有界线性算子 $A$，都存在 $g_A \in H$，使得：
$$
A f = \langle f, g_A \rangle_H, \quad \forall f \in H
$$
即希尔伯特空间中的任意有界线性算子，都可以表示为空间中某函数与被作用函数的内积。

**再生核希尔伯特空间的两个定义是等价的**。接下来我们讨论如何刻画具体的再生核希尔伯特空间。

#### 2.1.5. 再生核希尔伯特空间与希尔伯特空间的关系
再生核希尔伯特空间是希尔伯特空间的子集，但希尔伯特空间不一定是再生核希尔伯特空间。在普通希尔伯特空间中，赋值泛函**不一定连续（有界）**。当 $f_n$ 依范数收敛于 $f$ 时，无法推出 $\delta_x f_n$ 收敛于 $\delta_x f$。例如在 $L_2(0,1)$ 空间（同样是希尔伯特空间）中，取：

$$
f(x) = 0
$$
$$
f_n(x) = \sqrt{n} \cdot I\left(x < \frac{1}{n^2}\right)
$$

则：
$$
\| f_n - f \| = \left( \int_0^1 |\sqrt{n} \cdot I(x < \frac{1}{n^2}) - 0|^2 dx \right)^{\frac{1}{2}} = \left( \int_0^{\frac{1}{n^2}} n dx \right)^{\frac{1}{2}} = \frac{1}{\sqrt{n}} \to 0, \quad n \to \infty
$$

但是：

$$
\delta_0 f_n = \sqrt{n}
$$

并不会随着 $n$ 增大趋近于0。

因此，希尔伯特空间包含大量非光滑函数，而在再生核希尔伯特空间中，所有函数都**逐点收敛**：$f_n(x) \to f(x)$，即 $\delta_x f_n \to \delta_x f$。这说明再生核希尔伯特空间的约束比普通希尔伯特空间更严格。相比于普通希尔伯特空间，再生核希尔伯特空间中的函数**性质更优良**。对于任意 $f, f_n \in H$，当 $f_n$ 依范数收敛于 $f$ 时，恒有：

$$
\delta_x f_n = \langle f_n, k(\cdot, x) \rangle \to \langle f, k(\cdot, x) \rangle = f(x) = \delta_x f
$$

（赋值泛函同样是有界线性算子。）由此可得以下定理：

#### 2.1.6. 定理
若再生核希尔伯特空间中的两个函数依范数收敛，则它们一定**在所有点上逐点收敛**。即若：
$$
\lim_{n \to \infty} \| f_n - f \|_H = 0
$$
则：
$$
\lim_{n \to \infty} f_n(x) = f(x), \quad \forall x \in X
$$
- 希尔伯特空间具有**完备性**，因此希尔伯特空间中的所有柯西序列都依范数收敛。即若 $\{ f_n \}_{n=1}^{\infty}$ 是希尔伯特空间中的柯西序列，则对于任意 $\varepsilon > 0$，存在自然数 $N$，使得对所有 $i, j > N$：$$
  \| f_i - f_j \| < \varepsilon
  $$
- 再生核希尔伯特空间的条件更严格：要求所有柯西序列**逐点收敛**。即对所有 $x \in X$：
  $$
  | f_i(x) - f_j(x) | < \varepsilon
  $$

### 2.2. 再生核巴拿赫空间（RKBS）
**再生核希尔伯特空间（RKHS）** 是由函数 $f: X \to \mathbb{R}$ 构成的希尔伯特空间 $\mathcal{H}$，配备内积 $\langle \cdot, \cdot \rangle _{\mathcal{H}}$ 和满足**再生性**的**对称正定**核 $k: X \times X \to \mathbb{R}$：

$$
f(x) = \langle f, k(\cdot, x) \rangle _{\mathcal{H}} \quad \forall f \in \mathcal{H}, \forall x \in X.
$$

该核具有对称性（$k(x,y)=k(y,x)$），且生成的Gram矩阵为正定矩阵。这种结构保证了再生核希尔伯特空间中的优化问题（如SVM训练）是**凸优化**问题。

与之相对，**再生核巴拿赫空间（RKBS）** 是对该框架的推广。它涉及定义在集合 $X$ 和 $Y$ 上的**一对巴拿赫空间** $\left(\mathcal{B}_X, \mathcal{B}_Y\right)$（无需是希尔伯特空间）、一个可能**非对称、非正定**的核 $k: X \times Y \to \mathbb{R}$，以及一个**非退化双线性映射** $\langle \cdot, \cdot \rangle _{\mathcal{B}_X \times \mathcal{B}_Y}$，满足：

$$
f(x) = \langle f, k(\cdot, x) \rangle _{\mathcal{B}_X \times \mathcal{B}_Y},\forall f \in \mathcal{B}_X,\quad \quad
g(y) = \langle k(y, \cdot), g \rangle _{\mathcal{B}_X \times \mathcal{B}_Y},  \forall g \in \mathcal{B}_Y
$$

与再生核希尔伯特空间不同，再生核巴拿赫空间不要求内积、对称性和正定性。这种灵活性使其能够建模**非对称关系**，并自然适配深度学习中常见的**非凸优化**问题。

## 3. 注意力机制中的核函数

### 3.1. 点积注意力
本节聚焦于目前最主流的注意力机制。主要参考文献为《Transformer是深度无限维non-Mercer二元核机器》，论文链接：[http://arxiv.org/abs/2106.01506](http://arxiv.org/abs/2106.01506)。在Transformer的缩放点积注意力机制中，**核函数**定义为：

$$
\kappa(t, s) = \exp\left(\frac{(W^Q t)^\top (W^K s)}{\sqrt{d}}\right)
$$
其中：
- $t \in \mathbb{R}^{d_t}$ 表示目标/查询向量
- $s \in \mathbb{R}^{d_s}$ 表示源/键向量
- $W^Q \in \mathbb{R}^{d \times d_t}$ 和 $W^K \in \mathbb{R}^{d \times d_s}$ 是可学习权重矩阵
- $d$ 是注意力头的维度

该式对应Softmax归一化之前的**未归一化注意力权重**。

> **性质1：非对称性**
> 该核通常不具有对称性：
> $$\kappa(t, s) \neq \kappa(s, t) \quad (\text{仅当 } W^Q = W^K \text{ 时等号成立})$$
>
> 这反映了注意力机制中查询和键的不同功能定位。
>
> **性质2：非正定性**
>
> - 不属于Mercer核（不满足对称正定条件）
> - 对应的Gram矩阵可能是**不定矩阵**
> - 归类为**non-mercer kernel**
>
> **性质3：无限维特征映射**
>
> - 该核支持**无限维特征表示**：
>   查询的特征映射：
> $$\Phi_{\mathcal{X}}(t) = \sum_{n=0}^{\infty} \sum_{p_1+\cdots+p_d=n} \frac{\sqrt{\frac{n!}{p_1!\cdots p_d!}} \prod_{t=1}^d (q_t)^{p_t}}{d^{1/4}}$$
>键的特征映射：$$\Phi_{\mathcal{Y}}(s) = \sum_{n=0}^{\infty} \sum_{p_1+\cdots+p_d=n} \frac{\sqrt{\frac{n!}{p_1!\cdots p_d!}} \prod_{t=1}^d (k_t)^{p_t}}{d^{1/4}}$$
> 其中 $q = W^Q t$，$k = W^K s$。
>
> **性质4：再生性**
> 该核是一对再生核巴拿赫空间（RKBS）的**再生核**，满足：
> $$f(t) = \langle f, \kappa(\cdot, s) \rangle _{\mathcal{B} _{\mathcal{X}} \times \mathcal{B} _{\mathcal{Y}}}$$
>对关联巴拿赫空间 $\mathcal{B} _{\mathcal{X}}$ 和 $\mathcal{B} _{\mathcal{Y}}$ 中的所有函数成立。

该核诱导出**一对再生核巴拿赫空间**：

**查询空间：**
$$
\mathcal{B} _{\mathcal{X}} = \left\lbrace f _{\mathbf{k}}(t) = \exp\left((W^Q t)^\top \mathbf{k} / \sqrt{d}\right) : \mathbf{k} \in \mathcal{F} _{\mathcal{Y}}, t \in \mathcal{X} \right\rbrace
$$

**键空间：**

$$
\mathcal{B} _{\mathcal{Y}} = \left\lbrace g _{\mathbf{q}}(s) = \exp\left(\mathbf{q}^\top (W^K s) / \sqrt{d}\right): \mathbf{q} \in \mathcal{F} _{\mathcal{X}}, s \in \mathcal{Y} \right\rbrace
$$

其中 $\mathcal{F} _{\mathcal{X}}$ 和 $\mathcal{F} _{\mathcal{Y}}$ 是无限维特征空间。

### 3.2. 位置诱导注意力
从本节开始，我们将探究算子学习中的经典架构，并从核学习的视角对其进行分析。第一个架构来自：《位置知识足矣：用于算子学习的位置诱导Transformer（PiT）》，论文链接：[https://arxiv.org/abs/2405.09285](https://arxiv.org/abs/2405.09285)。

PiT架构包含三个核心模块：编码器、处理器和解码器。这些模块共享的核心组件是**位置诱导注意力**，它与标准自注意力有本质区别：注意力权重仅由位置信息构建，而非特征相似度。

#### 3.2.1. 位置注意力公式
设 $\{x_i\} _{i=1}^N \subset \mathbb{R}^d$ 为离散化点的空间坐标。位置注意力机制仅基于物理域中的点对距离定义注意力权重：
$$
\alpha _{ij}=\frac{\exp\!\big(-\lambda \|x_i - x_j\|_2^2\big)} {\sum_{k=1}^N \exp\!\big(-\lambda \|x_i - x_k\|_2^2\big)}
$$
其中 $\lambda > 0$ 控制交互作用的局部性。
给定输入特征 $u_j$，注意力输出为：
$$
(\mathcal A u)(x_i)=\sum_{j=1}^N \alpha_{ij}\, Wu_j
$$
其中 $W$ 是可学习矩阵。

#### 3.2.2. 核函数解释
从算子学习的视角，位置注意力可以被解释为带核积分算子的离散化形式：
$$
\kappa(x,y)=\frac{\exp\!\big(-\lambda \|x-y\|_2^2\big)}{\int _\Omega \exp\!\big(-\lambda \|x-\xi\|_2^2\big)\, d\xi}
$$
该核对应**归一化指数核**，其中相似度函数定义为：
$$
s(x,y) = -\lambda \|x-y\|_2^2
$$
该形式对应**高斯核**。若将相似度函数替换为内积 $s(x,y) = \langle x, y \rangle$，该公式将退化为标准点积注意力（无Softmax）。

#### 3.2.3. 不变性
高斯核 $\kappa(x,y) = \exp(-\lambda \|x-y\|_2^2)$ 具备多项重要的对称性质：

**平移不变性：**
$$
\kappa(x+a, y+a) = \kappa(x,y), \quad \forall a \in \mathbb{R}^d.
$$

**旋转不变性：**
$$
\kappa(Rx, Ry) = \kappa(x,y), \quad \forall R \in SO(d).
$$

这些不变性与大量物理算子的对称性高度契合，尤其适用于各向同性偏微分方程。从这个角度来看，PiT模型优异的实验效果部分归功于核结构带来的归纳偏置。

#### 3.2.4. 频域解释
高斯核在频域中有清晰的物理意义，其傅里叶变换满足：
$$
\widehat{\kappa}(\omega)\propto\exp\!\Big(-\frac{\|\omega\|_2^2}{4\lambda}\Big),
$$

该变换在高频段快速衰减。
因此，位置注意力等价于一个**低通滤波器**，能够抑制高频分量，保留平滑的大尺度结构。这一特性与大量椭圆型、抛物型偏微分方程解算子的谱特性一致，这类算子本身具有平滑作用。

#### 3.2.5. 局限性与潜在失效场景
尽管高斯核的偏置对平滑算子十分有利，但它也存在固有局限性。具体而言，位置注意力在以下场景中效果会显著下降：

- 算子保留或放大高频分量时；
- 解存在尖锐界面或间断点时；
- 对流占优或双曲型偏微分方程存在强方向传输特性时。

在这些情况下，高斯核的各向同性与低通特性会导致过度平滑，丢失精细尺度信息。这引发了一个核心问题：固定的各向同性核是否足以完成通用算子学习任务？是否需要设计更具适应性、各向异性的核结构？

### 3.3. Transolver：核函数的低秩分解
