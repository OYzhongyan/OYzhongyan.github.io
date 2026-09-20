---
title: "PPO"
date: "2026-09-20"
tags: ["强化学习", "智能", "控制论"]
abstract: "近端策略优化（Proximal Policy Optimization）的学习笔记。"
draft: false
---

考虑一个 MDP：$\mathcal{M}=(S,A,P,r,\gamma)$，其中 $s_t\in S$，$a_t\in A$，环境转移满足 $s_{t+1}\sim P(s_{t+1}|s_t,a_t)$，这里的概率 $P(s_{t+1}|s_t,a_t)$ 是环境动力学决定的，与策略参数 $\theta$ 无关。使用参数化随机策略 $a_t\sim\pi_\theta(a_t|s_t)$，一条长度为 $T$ 的轨迹记为 $\tau=(s_0,a_0,s_1,a_1,\cdots,s_T)$，设初始状态满足 $s_0\sim\rho_0(s_0)$，则轨迹 $\tau$ 在策略 $\pi_\theta$ 下出现的概率为 
$$
p_\theta(\tau)=\rho_0(s_0)\prod_{t=0}^{T-1}\pi_\theta(a_t|s_t)P(s_{t+1}|s_t,a_t)
$$
定义轨迹回报为 $R(\tau)=\sum_{t=0}^{T-1}\gamma^t r_t$，其中 $0\leq\gamma\leq1$ 为折扣因子，目标是寻找 $\theta^*=\arg\max_\theta J(\theta)$，其中 
$$
J(\theta)=\mathbb{E}_{\tau\sim p_\theta(\tau)}[R(\tau)]=\int p_\theta(\tau)R(\tau)d\tau
$$
对 $J(\theta)$ 关于 $\theta$ 求导得 
$$
\nabla_\theta J(\theta)=\int\nabla_\theta p_\theta(\tau)R(\tau)d\tau
$$
利用 log-derivative trick $\nabla_\theta p_\theta(\tau)=p_\theta(\tau)\nabla_\theta\log p_\theta(\tau)$，得到
$$
\nabla_\theta J(\theta)=\int p_\theta(\tau)\nabla_\theta\log p_\theta(\tau)R(\tau)d\tau=\mathbb{E}_{\tau\sim p_\theta}[\nabla_\theta\log p_\theta(\tau)R(\tau)]
$$
将 $\log p_\theta(\tau)$ 展开，由
$$
p_\theta(\tau)=\rho_0(s_0)\prod_{t=0}^{T-1}\pi_\theta(a_t|s_t)P(s_{t+1}|s_t,a_t)
$$
可得 
$$
\log p_\theta(\tau)=\log\rho_0(s_0)+\sum_{t=0}^{T-1}\log\pi_\theta(a_t|s_t)+\sum_{t=0}^{T-1}\log P(s_{t+1}|s_t,a_t)
$$
对 $\theta$ 求导得到 
$$
\nabla_\theta\log p_\theta(\tau)=\nabla_\theta\log\rho_0(s_0)+\sum_{t=0}^{T-1}\nabla_\theta\log\pi_\theta(a_t|s_t)+\sum_{t=0}^{T-1}\nabla_\theta\log P(s_{t+1}|s_t,a_t)
$$
由于初始状态分布和环境动力学都与策略参数 $\theta$ 无关，因此 $\nabla_\theta\log\rho_0(s_0)=0$，$\nabla_\theta\log P(s_{t+1}|s_t,a_t)=0$，所以 
$$
\nabla_\theta\log p_\theta(\tau)=\sum_{t=0}^{T-1}\nabla_\theta\log\pi_\theta(a_t|s_t)
$$
代入目标函数梯度得到 
$$
\nabla_\theta J(\theta)=\mathbb{E}_{\tau\sim p_\theta}\left[(\sum_{t=0}^{T-1}\nabla_\theta\log\pi_\theta(a_t|s_t))R(\tau)\right]
$$
对于时刻 $t$ 的动作 $a_t$，它不会影响已经发生的奖励 $r_0,r_1,\cdots,r_{t-1}$，因此在更新时刻 $t$ 的策略时只需要考虑从时刻 $t$ 开始的未来回报，定义 reward-to-go 为 
$$
G_t=\sum_{k=t}^{T-1}\gamma^{k-t}r_k
$$
于是可以将完整轨迹回报替换为 $G_t$，得到 
$$
\nabla_\theta J(\theta)=\mathbb{E}\left[\sum_{t=0}^{T-1}\nabla_\theta\log\pi_\theta(a_t|s_t)G_t\right]
$$
根据动作价值函数的定义 $Q^\pi(s_t,a_t)=\mathbb{E}[G_t|s_t,a_t]$，可以进一步写成 $\nabla_\theta J(\theta)=\mathbb{E}_{s_t,a_t\sim\pi_\theta}[\nabla_\theta\log\pi_\theta(a_t|s_t)Q^\pi(s_t,a_t)]$，这就是 ==Policy Gradient Theorem== 的基本形式。于是可以利用随机梯度上升更新策略参数 $\theta\leftarrow\theta+\alpha\nabla_\theta\log\pi_\theta(a_t|s_t)Q^\pi(s_t,a_t)$。实际中 $Q^\pi$ 未知，可以直接使用采样得到的 $G_t$，即 $\theta\leftarrow\theta+\alpha\nabla_\theta\log\pi_\theta(a_t|s_t)G_t$，这就是 REINFORCE。
直接使用 $G_t$ 或 $Q^\pi(s_t,a_t)$ 的一个主要问题是==梯度估计方差较大==，因此考虑引入一个只依赖状态的 baseline $b(s)$。注意 
$$
\mathbb{E}_{a\sim\pi_\theta}[\nabla_\theta\log\pi_\theta(a|s)b(s)]=b(s)\sum_a\pi_\theta(a|s)\nabla_\theta\log\pi_\theta(a|s)
$$
利用 
$$
\nabla_\theta\log\pi_\theta(a|s)=\frac{\nabla_\theta\pi_\theta(a|s)}{\pi_\theta(a|s)}
$$
得到 
$$
\mathbb{E}_{a\sim\pi_\theta}[\nabla_\theta\log\pi_\theta(a|s)b(s)]=b(s)\sum_a\nabla_\theta\pi_\theta(a|s)=b(s)\nabla_\theta\sum_a\pi_\theta(a|s)=b(s)\nabla_\theta1=0
$$
因此在 Policy Gradient 中减去任意只依赖状态的 baseline 都不会改变梯度期望，即 $\nabla_\theta J(\theta)=\mathbb{E}[\nabla_\theta\log\pi_\theta(a|s)(Q^\pi(s,a)-b(s))]$。一个自然的选择是令 $b(s)=V^\pi(s)$，定义 Advantage Function 为 $A^\pi(s,a)=Q^\pi(s,a)-V^\pi(s)$，于是 Policy Gradient 写成 $\nabla_\theta J(\theta)=\mathbb{E}[\nabla_\theta\log\pi_\theta(a|s)A^\pi(s,a)]$。其中 $A^\pi(s,a)>0$ 表示动作 $a$ 相对于状态 $s$ 下当前策略的平均动作更加优秀，因此希望增加 $\pi_\theta(a|s)$；反之，当 $A^\pi(s,a)<0$ 时，希望降低 $\pi_\theta(a|s)$。
真实的状态价值函数 $V^\pi(s)$ 通常未知，因此使用参数化函数 $V_\phi(s)$ 进行近似。根据 Bellman Equation，$V^\pi(s_t)=\mathbb{E}[r_t+\gamma V^\pi(s_{t+1})|s_t]$，于是定义 TD error 为 $\delta_t=r_t+\gamma V_\phi(s_{t+1})-V_\phi(s_t)$。如果 $V_\phi(s)=V^\pi(s)$，则 
$$
\mathbb{E}[\delta_t|s_t,a_t]=\mathbb{E}[r_t+\gamma V^\pi(s_{t+1})-V^\pi(s_t)|s_t,a_t]=Q^\pi(s_t,a_t)-V^\pi(s_t)=A^\pi(s_t,a_t)
$$
因此可以使用 $\delta_t$ 作为 Advantage 的估计。此时 Actor 更新为 $\theta\leftarrow\theta+\alpha_\theta\delta_t\nabla_\theta\log\pi_\theta(a_t|s_t)$，Critic 可以通过最小化 $L_V(\phi)=\frac12(r_t+\gamma V_\phi(s_{t+1})-V_\phi(s_t))^2$ 来学习状态价值函数，这就是基本的 Advantage Actor-Critic。
直接使用 $\hat A_t=\delta_t$ 相当于 one-step TD，其**方差较低但 bias 可能较大**，而使用完整 Monte Carlo return $\hat A_t=G_t-V_\phi(s_t)$ 的 **bias 较小但方差较大**，因此引入 Generalized Advantage Estimation，即 GAE。首先定义 $\delta_t=r_t+\gamma V_\phi(s_{t+1})-V_\phi(s_t)$，然后定义 
$$
\hat A_t^{\mathrm{GAE}}=\delta_t+\gamma\lambda\delta_{t+1}+(\gamma\lambda)^2\delta_{t+2}+\cdots=\sum_{l=0}^{T-t-1}(\gamma\lambda)^l\delta_{t+l}
$$
其中 $0\leq\lambda\leq1$。当 $\lambda=0$ 时有 $\hat A_t=\delta_t$，退化为 TD(0)；当 $\lambda\rightarrow1$ 时，Advantage 估计逐渐接近 Monte Carlo return，因此 $\lambda$ 控制 **bias-variance tradeoff**。
接下来考虑==**策略更新过程中数据分布发生变化的问题**==。假设使用旧策略 $\pi_{\theta_{\mathrm{old}}}$ 与环境交互并收集一批数据 $\mathcal D=\{s_t,a_t,r_t,s_{t+1}\}$，其中 $a_t\sim\pi_{\theta_{\mathrm{old}}}(a_t|s_t)$。如果只进行一次非常小的梯度更新，则新旧策略比较接近，但如果对同一批数据进行多次梯度更新，**当前策略 $\pi_\theta$ 就可能逐渐偏离产生这些数据的旧策略** $\pi_{\theta_{\mathrm{old}}}$（从而导致使用旧策略$\pi_{\theta_{\text{old}}}$的数据对新策略进行$\pi_{\theta}$更新），因此需要==使用 importance sampling 对策略分布变化进行修正==。对于任意函数 $f(a)$，有 
$$
\mathbb{E}_{a\sim\pi_\theta}[f(a)]=\sum_a\pi_\theta(a|s)f(a)=\sum_a\pi_{\theta_{\mathrm{old}}}(a|s)\frac{\pi_\theta(a|s)}{\pi_{\theta_{\mathrm{old}}}(a|s)}f(a)=\mathbb{E}_{a\sim\pi_{\theta_{\mathrm{old}}}}[\frac{\pi_\theta(a|s)}{\pi_{\theta_{\mathrm{old}}}(a|s)}f(a)]
$$
因此定义 probability ratio 为 
$$
r_t(\theta)=\frac{\pi_\theta(a_t|s_t)}{\pi_{\theta_{\mathrm{old}}}(a_t|s_t)}
$$
需要注意这里的 $r_t(\theta)$ 是新旧策略对同一个动作的概率比，并不是环境奖励。利用这个 probability ratio，可以构造 surrogate objective $L^{PG}(\theta)=\mathbb{E}_t[r_t(\theta)\hat A_t]$。在 $\theta=\theta_{\mathrm{old}}$ 时有 $r_t(\theta_{\mathrm{old}})=1$，并且 
$$
\nabla_\theta r_t(\theta)=\nabla_\theta\frac{\pi_\theta(a_t|s_t)}{\pi_{\theta_{\mathrm{old}}}(a_t|s_t)}=\frac{\nabla_\theta\pi_\theta(a_t|s_t)}{\pi_{\theta_{\mathrm{old}}}(a_t|s_t)}
$$
在 $\theta=\theta_{\mathrm{old}}$ 处，有 
$$
\nabla_\theta r_t(\theta)|_{\theta=\theta_{\mathrm{old}}}=\frac{\nabla_\theta\pi_{\theta_{\mathrm{old}}}(a_t|s_t)}{\pi_{\theta_{\mathrm{old}}}(a_t|s_t)}=\nabla_\theta\log\pi_{\theta_{\mathrm{old}}}(a_t|s_t)
$$
因此 $\nabla_\theta L^{PG}(\theta)|_{\theta=\theta_{\mathrm{old}}}=\mathbb{E}_t[\nabla_\theta\log\pi_{\theta_{\mathrm{old}}}(a_t|s_t)\hat A_t]$，恰好恢复标准 Policy Gradient，因此 $L^{PG}(\theta)=\mathbb{E}_t[r_t(\theta)\hat A_t]$ 可以视为原始 Policy Gradient 的 surrogate objective。问题在于，如果 $\hat A_t>0$，最大化 $r_t(\theta)\hat A_t$ 会推动 $r_t(\theta)$ 持续增大，即持续增加 $\pi_\theta(a_t|s_t)$；如果 $\hat A_t<0$，最大化 $r_t(\theta)\hat A_t$ 会推动 $r_t(\theta)$ 持续减小。因此如果在同一批数据上进行过多次优化，新策略可能远离产生数据的旧策略，使得 $\pi_\theta\not\approx\pi_{\theta_{\mathrm{old}}}$，从而导致训练不稳定。TRPO 的基本思想是在**提高策略性能的同时限制新策略与旧策略之间的距离**，其优化问题可以写为 $\max_\theta\mathbb{E}_t[r_t(\theta)\hat A_t]$，同时满足 $\mathbb{E}_{s_t}[D_{\mathrm{KL}}(\pi_{\theta_{\mathrm{old}}}(\cdot|s_t)\|\pi_\theta(\cdot|s_t))]\leq\delta$。
因此 TRPO 要求 $\pi_\theta$ 只能在 $\pi_{\theta_{\mathrm{old}}}$ 附近的一个 trust region 中更新。令 $\Delta\theta=\theta-\theta_{\mathrm{old}}$，在 $\theta_{\mathrm{old}}$ 附近对目标函数进行一阶展开，可以写成 $L(\theta)\approx L(\theta_{\mathrm{old}})+g^\top\Delta\theta$，其中 $g=\nabla_\theta L(\theta)|_{\theta=\theta_{\mathrm{old}}}$。KL divergence 在 $\theta_{\mathrm{old}}$ 附近的一阶项为零，因此其二阶近似可以写成 $D_{\mathrm{KL}}\approx\frac12\Delta\theta^\top F\Delta\theta$，其中 $F$ 为 Fisher Information Matrix。于是 TRPO 可以近似写成约束优化问题 $\max_{\Delta\theta}g^\top\Delta\theta$，满足 $\frac12\Delta\theta^\top F\Delta\theta\leq\delta$。构造 Lagrangian $\mathcal L=g^\top\Delta\theta-\lambda(\frac12\Delta\theta^\top F\Delta\theta-\delta)$，对 $\Delta\theta$ 求导并令其为零，得到 $g-\lambda F\Delta\theta=0$，所以 $\Delta\theta=\frac1\lambda F^{-1}g$，进一步代入约束可得 $\Delta\theta=\sqrt{\frac{2\delta}{g^\top F^{-1}g}}F^{-1}g$，因此 TRPO 与 Natural Gradient 有直接联系。但是 TRPO 需要处理 Fisher Information Matrix，并利用 conjugate gradient 等方法计算 $F^{-1}g$，实现较复杂。
PPO 希望保留 TRPO 中“**限制一次策略更新不能离旧策略太远**”的核心思想，但避免显式求解带 KL 约束的二阶优化问题，因此直接对 probability ratio 
$$
r_t(\theta)=\frac{\pi_\theta(a_t|s_t)}{\pi_{\theta_{\mathrm{old}}}(a_t|s_t)}
$$
构造 clipped surrogate objective。PPO 的核心目标函数为 $L^{\mathrm{CLIP}}(\theta)=\mathbb{E}_t[\min(r_t(\theta)\hat A_t,\operatorname{clip}(r_t(\theta),1-\epsilon,1+\epsilon)\hat A_t)]$，其中 $\operatorname{clip}(r,1-\epsilon,1+\epsilon)$ 将 $r$ 截断在区间 $[1-\epsilon,1+\epsilon]$ 中，通常 $\epsilon$ 取 $0.1\sim0.2$。当 $\hat A_t>0$ 时，动作 $a_t$ 是相对优秀的动作，因此希望提高 $\pi_\theta(a_t|s_t)$，也就是提高 $r_t(\theta)$。当 $r_t(\theta)\leq1+\epsilon$ 时，目标函数中保留 $r_t(\theta)\hat A_t$，因此增加动作概率仍然能够提高目标函数；但是当 $r_t(\theta)>1+\epsilon$ 时，由于 $\hat A_t>0$，有 $r_t(\theta)\hat A_t>(1+\epsilon)\hat A_t$，因此 $\min(r_t(\theta)\hat A_t,(1+\epsilon)\hat A_t)=(1+\epsilon)\hat A_t$，此时继续增加动作概率已经无法进一步提高目标函数。当 $\hat A_t<0$ 时，动作 $a_t$ 是相对较差的动作，因此希望降低 $\pi_\theta(a_t|s_t)$，也就是降低 $r_t(\theta)$。当 $r_t(\theta)\geq1-\epsilon$ 时，目标函数仍然保留 $r_t(\theta)\hat A_t$；但是当 $r_t(\theta)<1-\epsilon$ 时，因为 $\hat A_t<0$，有 $r_t(\theta)\hat A_t>(1-\epsilon)\hat A_t$，因此 $\min(r_t(\theta)\hat A_t,(1-\epsilon)\hat A_t)=(1-\epsilon)\hat A_t$，此时继续降低这个动作的概率也不会进一步提高目标函数。因此 PPO 并不是简单地强制 $r_t(\theta)\in[1-\epsilon,1+\epsilon]$，而是在策略已经沿着能够提高 surrogate objective 的方向变化过多时，使该样本对应的目标函数进入饱和状态，从而停止继续奖励这种过度更新。PPO 的目标是最大化 $L^{\mathrm{CLIP}}(\theta)$，但神经网络优化器通常执行梯度下降，因此实际定义 Actor Loss 为 
$$
L_{\mathrm{actor}}=-L^{\mathrm{CLIP}}(\theta)=-\mathbb{E}_t[\min(r_t(\theta)\hat A_t,\operatorname{clip}(r_t(\theta),1-\epsilon,1+\epsilon)\hat A_t)]
$$
Critic 负责学习状态价值函数 $V^\pi(s)$，通常定义 value target 为 $\hat R_t=\hat A_t+V_{\phi_{\mathrm{old}}}(s_t)$，并最小化 $L_{\mathrm{value}}(\phi)=\mathbb{E}_t[(V_\phi(s_t)-\hat R_t)^2]$。为了避免策略过快变成确定性策略，还可以加入 entropy bonus，定义策略熵为 $H(\pi_\theta(\cdot|s))=-\mathbb{E}_{a\sim\pi_\theta}[\log\pi_\theta(a|s)]$，从而鼓励策略保持一定探索性。最终 PPO 的总损失函数通常写成 
$$
L_{\mathrm{PPO}}=L_{\mathrm{actor}}+c_vL_{\mathrm{value}}-c_eH(\pi_\theta)=-L^{\mathrm{CLIP}}+c_vL_{\mathrm{value}}-c_eH(\pi_\theta)
$$
其中 $c_v$ 控制 Critic Loss 权重，$c_e$ 控制 entropy regularization 权重，最终利用梯度下降更新参数 $(\theta,\phi)\leftarrow(\theta,\phi)-\alpha\nabla_{\theta,\phi}L_{\mathrm{PPO}}$。对于连续动作空间，通常令策略为高斯分布 $\pi_\theta(a|s)=\mathcal N(\mu_\theta(s),\operatorname{diag}(\sigma_\theta^2(s)))$，其中 Actor 网络根据状态 $s$ 输出均值 $\mu_\theta(s)$ 和标准差 $\sigma_\theta(s)$，动作通过 $a_t\sim\mathcal N(\mu_\theta(s_t),\operatorname{diag}(\sigma_\theta^2(s_t)))$ 采样。对于 $d$ 维高斯策略，其 log probability 可以写成 
$$
\log\pi_\theta(a|s)=-\frac12\sum_{i=1}^d[(a_i-\mu_i(s))^2/\sigma_i^2(s)+2\log\sigma_i(s)+\log(2\pi)]
$$
实际实现时不会直接计算两个可能极小的概率之比，而是利用 $r_t(\theta)=\exp(\log\pi_\theta(a_t|s_t)-\log\pi_{\theta_{\mathrm{old}}}(a_t|s_t))$，因此代码中通常可以看到 `ratio = torch.exp(new_log_prob - old_log_prob)`。一次完整的 PPO 迭代过程可以概括为：首先使用旧策略 $\pi_{\theta_{\mathrm{old}}}$ 与环境交互并采样一批轨迹，同时保存 $s_t$、$a_t$、$r_t$、$s_{t+1}$、$\log\pi_{\theta_{\mathrm{old}}}(a_t|s_t)$ 和 $V_{\phi_{\mathrm{old}}}(s_t)$；然后计算 TD error $\delta_t=r_t+\gamma V_{\phi_{\mathrm{old}}}(s_{t+1})-V_{\phi_{\mathrm{old}}}(s_t)$；再通过 GAE 计算 
$$
\hat A_t=\sum_{l=0}^{T-t-1}(\gamma\lambda)^l\delta_{t+l}
$$
构造 value target $\hat R_t=\hat A_t+V_{\phi_{\mathrm{old}}}(s_t)$；接着对同一批数据进行若干个 epoch 的 mini-batch 优化，每次重新计算当前策略下的 $\log\pi_\theta(a_t|s_t)$，由此得到 $r_t(\theta)=\exp(\log\pi_\theta(a_t|s_t)-\log\pi_{\theta_{\mathrm{old}}}(a_t|s_t))$，并计算 $L^{\mathrm{CLIP}}(\theta)=\mathbb{E}_t[\min(r_t(\theta)\hat A_t,\operatorname{clip}(r_t(\theta),1-\epsilon,1+\epsilon)\hat A_t)]$，同时优化 Critic Loss 和 entropy bonus；完成若干轮优化后令 $\theta_{\mathrm{old}}\leftarrow\theta$，使用更新后的策略重新与环境交互并收集下一批数据，如此循环。整个 PPO 的数学演化链条可以概括为 
$$
\begin{aligned}
&J(\theta)=\mathbb{E}_{\tau\sim p_\theta}[R(\tau)] \\ 
&\rightarrow\nabla_\theta J(\theta)=\mathbb{E}[\nabla_\theta\log\pi_\theta(a|s)Q^\pi(s,a)]\\ 
&\rightarrow\nabla_\theta J(\theta)=\mathbb{E}[\nabla_\theta\log\pi_\theta(a|s)A^\pi(s,a)]\\ 
&\rightarrow\hat A_t^{\mathrm{GAE}}=\sum_l(\gamma\lambda)^l\delta_{t+l}\\ 
&\rightarrow r_t(\theta)=\pi_\theta(a_t|s_t)/\pi_{\theta_{\mathrm{old}}}(a_t|s_t)\\ 
&\rightarrow L^{PG}(\theta)=\mathbb{E}[r_t(\theta)\hat A_t]\\ 
&\rightarrow L^{\mathrm{CLIP}}(\theta)=\mathbb{E}[\min(r_t(\theta)\hat A_t,\operatorname{clip}(r_t(\theta),1-\epsilon,1+\epsilon)\hat A_t)]
\end{aligned}
$$
因此可以将 PPO 理解为在 Advantage Actor-Critic 的基础上，通过 GAE 估计 Advantage，通过新旧策略概率比构造 surrogate objective，再通过 clipping 机制近似限制新旧策略之间的变化幅度，从而得到一个可以直接使用一阶随机梯度优化器训练、同时具有较好策略更新稳定性的 Actor-Critic 算法。