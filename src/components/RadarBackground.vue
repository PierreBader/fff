<template>
    <div class="radar-background">
        <svg
            class="radar-svg"
            :viewBox="'0 0' + WIDTH + ' ' + HEIGHT"
            preserveAspectRatio="xMidYMid slice"
        >
            <g
                v-for="particle in particles"
                :key="particle.id"
                :opacity="particle.opacity"
                :transform="particleTransform(particle)"
                :class="{
                    'logo-particle': particle.isLogo,
                    'decorative-particle': !particle.isLogo,
                }"
            >
                <text
                    v-if="particle.type === 'letter'"
                    class="particle-letter"
                    text-anchor="middle"
                    dominant-baseline="middle"
                >
                    {{ particle.value }}
                </text>

                <circle
                    v-else
                    class="particle-dot"
                    cx="0"
                    cy="0"
                    :r="particle.isLogo ? 4 : particle.radius"
                />
            </g>

            <circle
                class="logo-flash"
                :class="{ active: animationState === 'logo' }"
                cx="768"
                cy="450"
                r="100"
            />
        </svg>

        <div class="page-content">
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

const WIDTH = 3000;
const HEIGHT = 1500;
const DECORATIVE_PARTICLES = 200;
const CONVERGENCE_DURATION = 500;
const CONVERGENCE_STAGGER = 90;
const LETTER_PROBABILITY = 0.25;

type LogoLetter = {
    type: "letter";
    value: string;
    x: number;
    y: number;
};

type LogoDot = {
    type: "dot";
    x: number;
    y: number;
};

type LogoElement = LogoLetter | LogoDot;

const LOGO: LogoElement[] = [
    {
        type: "letter",
        value: "R",
        x: 240,
        y: 450,
    },
    {
        type: "dot",
        x: 280,
        y: 458,
    },
    {
        type: "letter",
        value: "A",
        x: 320,
        y: 450,
    },
    {
        type: "dot",
        x: 360,
        y: 458,
    },
    {
        type: "letter",
        value: "D",
        x: 400,
        y: 450,
    },
    {
        type: "dot",
        x: 440,
        y: 458,
    },
    {
        type: "letter",
        value: "A",
        x: 480,
        y: 450,
    },
    {
        type: "dot",
        x: 520,
        y: 458,
    },
    {
        type: "letter",
        value: "R",
        x: 560,
        y: 450,
    },
    {
        type: "dot",
        x: 600,
        y: 458,
    },
    {
        type: "dot",
        x: 192,
        y: 433,
    },
    {
        type: "dot",
        x: 210,
        y: 490,
    },
    {
        type: "dot",
        x: 260,
        y: 405,
    },
    {
        type: "dot",
        x: 300,
        y: 510,
    },
    {
        type: "dot",
        x: 340,
        y: 380,
    },
    {
        type: "dot",
        x: 375,
        y: 550,
    },
    {
        type: "dot",
        x: 430,
        y: 525,
    },
    {
        type: "dot",
        x: 455,
        y: 360,
    },
    {
        type: "dot",
        x: 500,
        y: 510,
    },
    {
        type: "dot",
        x: 540,
        y: 405,
    },
    {
        type: "dot",
        x: 580,
        y: 490,
    },
    {
        type: "dot",
        x: 625,
        y: 433,
    },
];

type ParticleType = "letter" | "dot";

interface Particle {
    id: number;
    type: ParticleType;
    value: string | undefined;
    x: number;
    y: number;
    vx: number;
    vy: number;
    rotation: number;
    rotationSpeed: number;
    radius: number;
    opacity: number;
    isLogo: boolean;
    startX: number;
    startY: number;
    startRotation: number;
    targetX: number;
    targetY: number;
    targetRotation: number;
    convergenceDelay: number;
}

const particles = ref<Particle[]>([]);
const animationState = ref<"idle" | "converging" | "logo">("idle");

let animationFrame = 0;
let lastTime = 0;
let convergenceStart = 0;

let animationPromise: Promise<void> | null = null;
let animationResolve: (() => void) | null = null;

function random(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

function randomLetter(): string {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    const index = Math.floor(Math.random() * letters.length);

    return letters[index] ?? "A";
}

function createParticle(
    id: number,
    isLogo = false,
    logoElement?: LogoElement,
    logoIndex = 0,
): Particle {
    let type: ParticleType;

    let value: string | undefined;

    if (logoElement) {
        type = logoElement.type;

        if (logoElement.type === "letter") {
            value = logoElement.value;
        }
    } else {
        type = Math.random() < LETTER_PROBABILITY ? "letter" : "dot";

        if (type === "letter") {
            value = randomLetter();
        }
    }

    const x = random(40, WIDTH - 40);
    const y = random(40, HEIGHT - 40);

    const angle = random(0, Math.PI * 2);

    const speed = random(4, 12);

    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;

    const radius = random(3, 5);

    return {
        id,
        type,
        value,
        x,
        y,
        vx,
        vy,
        rotation: random(-20, 20),
        rotationSpeed: random(-2, 2),
        radius,
        opacity: random(0.3, 0.85),
        isLogo,
        startX: x,
        startY: y,
        startRotation: 0,
        targetX: logoElement?.x ?? x,
        targetY: logoElement?.y ?? y,
        targetRotation: 0,
        convergenceDelay: logoIndex * CONVERGENCE_STAGGER,
    };
}

function createParticles() {
    const result: Particle[] = [];

    LOGO.forEach((logoElement, index) => {
        result.push(createParticle(index, true, logoElement, index));
    });

    for (let i = 0; i < DECORATIVE_PARTICLES; i++) {
        result.push(createParticle(LOGO.length + i));
    }

    particles.value = result;
}

function updateIdle(delta: number) {
    const seconds = delta / 1000;

    for (const particle of particles.value) {
        particle.x += particle.vx * seconds;
        particle.y += particle.vy * seconds;

        particle.rotation += particle.rotationSpeed * seconds;

        if (particle.x < -100) {
            particle.x = WIDTH + 100;
        }

        if (particle.x > WIDTH + 100) {
            particle.x = -100;
        }

        if (particle.y < -100) {
            particle.y = HEIGHT + 100;
        }

        if (particle.y > HEIGHT + 100) {
            particle.y = -100;
        }
    }
}

function easeInOutQuint(t: number): number {
    return t < 0.5 ? 16 * t ** 5 : 1 - Math.pow(-2 * t + 2, 5) / 2;
}

function updateConvergence(now: number, delta: number) {
    const elapsed = now - convergenceStart;
    const seconds = delta / 1000;

    let allFinished = true;

    for (const particle of particles.value) {
        if (!particle.isLogo) {
            const fadeProgress = Math.min(elapsed / (CONVERGENCE_DURATION * 0.75), 1);
            const newOpacity = 0.85 * (1 - fadeProgress);
            particle.opacity = Math.min(particle.opacity, newOpacity);
            particle.x += particle.vx * seconds;
            particle.y += particle.vy * seconds;

            particle.rotation += particle.rotationSpeed * seconds;

            if (particle.x < -100) {
                particle.x = WIDTH + 100;
            }

            if (particle.x > WIDTH + 100) {
                particle.x = -100;
            }

            if (particle.y < -100) {
                particle.y = HEIGHT + 100;
            }

            if (particle.y > HEIGHT + 100) {
                particle.y = -100;
            }

            continue;
        }

        const localElapsed = elapsed - particle.convergenceDelay;

        if (localElapsed <= 0) {
            allFinished = false;
            continue;
        }

        const progress = Math.min(localElapsed / CONVERGENCE_DURATION, 1);
        const eased = easeInOutQuint(progress);

        particle.x = particle.startX + (particle.targetX - particle.startX) * eased;
        particle.y = particle.startY + (particle.targetY - particle.startY) * eased;

        const centerX = WIDTH / 2;
        const direction = particle.startX < centerX ? 1 : -1;
        const rotations = 1.5;

        particle.rotation = particle.startRotation + direction * 360 * rotations * (1 - eased);
        particle.opacity = 1;

        if (progress < 1) {
            allFinished = false;
        }
    }

    if (allFinished) {
        animationState.value = "logo";

        for (const particle of particles.value) {
            if (particle.isLogo) {
                particle.x = particle.targetX;
                particle.y = particle.targetY;
                particle.rotation = particle.targetRotation;
                particle.opacity = 1;
            } else {
                particle.opacity = 0;
            }
        }

        animationResolve?.();

        animationResolve = null;
        animationPromise = null;
    }
}

function particleTransform(particle: Particle): string {
    return `
    translate(
      ${particle.x}
      ${particle.y}
    )
    rotate(${particle.rotation})
  `;
}

function animate(now: number) {
    if (!lastTime) {
        lastTime = now;
    }

    const delta = Math.min(now - lastTime, 50);
    lastTime = now;

    if (animationState.value === "idle") {
        updateIdle(delta);
    } else if (animationState.value === "converging") {
        updateConvergence(now, delta);
    }

    animationFrame = requestAnimationFrame(animate);
}

function playLogoAnimation(): Promise<void> {
    if (animationState.value === "logo") {
        return Promise.resolve();
    }

    if (animationPromise) {
        return animationPromise;
    }

    for (const particle of particles.value) {
        if (particle.isLogo) {
            particle.startX = particle.x;
            particle.startY = particle.y;

            particle.startRotation = particle.rotation;
        }
    }

    convergenceStart = performance.now();
    animationState.value = "converging";

    animationPromise = new Promise<void>((resolve) => {
        animationResolve = resolve;
    });

    return animationPromise;
}

defineExpose({
    playLogoAnimation,
});

onMounted(() => {
    createParticles();

    animationFrame = requestAnimationFrame(animate);
});

onBeforeUnmount(() => {
    cancelAnimationFrame(animationFrame);
});
</script>

<style scoped>
.radar-background {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background: #000;
    color: #fff;
}

.radar-svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: visible;
    pointer-events: none;
}

.particle-letter {
    fill: #fff;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 50px;
    font-weight: 400;
    user-select: none;
}

.particle-dot {
    fill: #fff;
}

.logo-particle {
    transform-origin: center;
}

.logo-flash {
    fill: none;
    stroke: #fff;
    stroke-width: 2;
    opacity: 0;
    transform-box: fill-box;
    transform-origin: center;
}

.logo-flash.active {
    animation: logoFlash 900ms cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes logoFlash {
    0% {
        opacity: 0.8;
        transform: scale(0.1);
    }

    45% {
        opacity: 0.35;
        transform: scale(1);
    }

    100% {
        opacity: 0;
        transform: scale(1.8);
    }
}

.page-content {
    position: relative;
    z-index: 10;
    width: 100%;
    height: 100%;
    pointer-events: none;
}

.page-content :deep(button),
.page-content :deep(input),
.page-content :deep(form) {
    pointer-events: auto;
}

@media (max-width: 700px) {
    .particle-letter {
        font-size: 130px;
    }
}
</style>
