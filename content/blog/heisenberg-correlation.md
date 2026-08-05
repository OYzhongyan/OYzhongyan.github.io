---
title: "海森堡链中的关联函数：从精确解到数值方法"
date: "2026-07-20"
tags: ["量子物理", "海森堡模型", "关联函数"]
abstract: "回顾一维自旋 1/2 海森堡模型中两点关联函数的精确结果，并对比 DMRG 数值计算。"
draft: false
---

## 引言

一维各向同性自旋 1/2 海森堡模型（Heisenberg model）是凝聚态理论物理的典范模型之一。其哈密顿量为

$$
H = J \sum_{i=1}^{L-1} \vec{S}_i \cdot \vec{S}_{i+1},
$$

其中 $\vec{S}_i = (S_i^x, S_i^y, S_i^z)$ 是格点 $i$ 上的自旋 1/2 算符，$J$ 为交换耦合常数（$J>0$ 为反铁磁）。

## 关联函数

我们关心的核心物理量是**纵向自旋关联函数**

$$
C(r) = \langle S_i^z S_{i+r}^z \rangle - \langle S_i^z \rangle^2.
$$

对于半满填充的各向同性反铁磁海森堡链，Bethe ansatz 给出了精确的渐近形式：

$$
C(r) \sim (-1)^r \, \frac{\sqrt{\ln r}}{(2\pi)^{3/2} \, r} - \frac{1}{4\pi^2 r^2}.
$$

> 这里出现的 $\sqrt{\ln r}$ 项非常特殊，它来源于**边缘场论**（marginally irrelevant operator）的修正，使得海森堡链不同于一般 Luttinger 液体。

## 数值验证：DMRG

我们用密度矩阵重整化群（DMRG）计算了 $L=200$ 的开链系统，截断维数 $\chi = 512$。下面是简要的伪代码：

```python
import numpy as np
from tenpy.models.xxz_chain import XXZChain
from tenpy.networks.mps import MPS
from tenpy.algorithms import dmrg

model_params = {'L': 200, 'Jxx': 1.0, 'Jz': 1.0, 'hz': 0.0, 'bc': 'open'}
M = XXZChain(model_params)
psi = MPS.from_lat_product_state(M.lat, [['up'], ['down']])

dmrg_params = {'trunc_params': {'chi_max': 512, 'svd_min': 1e-10}, 'mixer': True}
info = dmrg.run(psi, M, dmrg_params)
```

计算关联函数后，我们在双对数坐标下拟合得到有效指数，与 $r^{-1}$ 的预言一致（带上 $\sqrt{\ln r}$ 的修正）。

## 小结

- 海森堡链关联函数具有 $(-1)^r$ 的交错性
- 主体按 $1/r$ 衰减，但带上 $\sqrt{\ln r}$ 的对数修正
- DMRG 数值可以精确捕捉该修正

下一篇我们将讨论 Renyi 熵，它从另一个角度刻画了该体系的量子纠缠。
