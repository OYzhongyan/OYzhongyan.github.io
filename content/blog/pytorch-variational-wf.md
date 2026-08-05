---
title: "用 PyTorch 拟合一个简单的变分波函数"
date: "2026-06-10"
tags: ["机器学习", "PyTorch", "变分法", "笔记"]
abstract: "用一个最小的例子演示如何用 PyTorch 实现神经网络变分波函数，并优化基态能量。"
draft: false
---

## 思路

给定哈密顿量 $H$，我们想找变分波函数 $|\psi_\theta\rangle$ 使能量期望最小：

$$
E(\theta) = \frac{\langle \psi_\theta | H | \psi_\theta \rangle}{\langle \psi_\theta | \psi_\theta \rangle} \to \min_\theta.
$$

把 $\psi_\theta(s)$ 参数化为一个神经网络（输入自旋构型 $s \in \{+1,-1\}^L$，输出复振幅），然后用 PyTorch 自动微分做梯度下降。

## 极简实现

```python
import torch
import torch.nn as nn

class RBMWaveFunction(nn.Module):
    def __init__(self, L, hidden_dim):
        super().__init__()
        self.W = nn.Parameter(torch.randn(hidden_dim, L) * 0.1)
        self.b = nn.Parameter(torch.zeros(hidden_dim))
        self.a = nn.Parameter(torch.zeros(L))

    def amplitude(self, s):
        # s: (B, L) in {+1, -1}
        visible = s @ self.W.t() + self.b   # (B, hidden)
        return torch.exp(visible.sum(dim=1))  # 简化的实振幅

    def forward(self, s):
        return self.amplitude(s)
```

## 能量估计

对于经典的横场 Ising 模型

$$
H = -J \sum_{\langle ij \rangle} \sigma_i^z \sigma_j^z - h \sum_i \sigma_i^x,
$$

我们用 Monte Carlo 采样估计 $E(\theta)$。这里给出一个采样到估计的简化接口：

```python
def estimate_energy(model, L, J=1.0, h=1.0, n_samples=1024):
    s = (torch.rand(n_samples, L) > 0.5).float() * 2 - 1
    psi = model(s)
    psi_conj = psi.conj()

    # ZZ 相互作用（精确求和，无需采样）
    zz = -(s[:, :-1] * s[:, 1:]).sum(dim=1) * J
    E_zz = (psi_conj * psi * zz).sum() / (psi_conj * psi).sum()

    # 横场项需要 sum over flip neighbors，这里略
    return E_zj.real
```

> 注意：完整实现里横场项需要翻转每个自旋并求和，本代码只展示骨架。

## 经验小结

1. **初始化很重要**：RBM 权重用 $\mathcal{N}(0, 0.01)$ 比默认 $1$ 数量级稳定得多
2. **学习率**：Adam 取 $10^{-3} \sim 10^{-2}$ 通常工作良好
3. **数值稳定**：用 $\log \psi$ 而非 $\psi$，避免 overflow
4. **对称性**：把 $\mathbb{Z}_2$ 对称性编码进网络结构可显著加速收敛

公式上，能量梯度可以写成漂亮的形式：

$$
\frac{\partial E}{\partial \theta} = 2 \, \mathrm{Re} \left[ \langle O_\theta^* (H - E) \rangle \right],
$$

其中 $O_\theta = \partial_\theta \log \psi_\theta$ 是所谓的"score function"。
