import { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import discordImg from '../imports/image-1.png';
import telegramImg from '../imports/image-2.png';

interface WebsiteStatus {
  url: string;
  status: 'online' | 'slow' | 'offline';
  responseTime: number | null;
  checking: boolean;
}

interface Website {
  emoji: string;
  title: string;
  description: string;
  url: string;
}

const websites: Website[] = [
  {
    emoji: '🌐',
    title: 'Official 303 Shop Website',
    description: 'Premium socials marketplace',
    url: 'https://303.mysellauth.com/'
  },
  {
    emoji: '🚀',
    title: '303 Website',
    description: 'Main community hub',
    url: 'https://303shop.vercel.app/'
  },
  {
    emoji: '❓',
    title: 'FAQ Website',
    description: 'Frequently asked questions',
    url: 'https://zws999.github.io/faq/'
  },
  {
    emoji: '💎',
    title: 'Donator Website',
    description: 'VIP member access',
    url: 'https://zws999.github.io/website1/'
  }
];

export default function App() {
  const [websiteStatuses, setWebsiteStatuses] = useState<Record<string, WebsiteStatus>>({});
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentTime, setCurrentTime] = useState(new Date());
  const cursorTrailRef = useRef<HTMLDivElement>(null);

  // Live status checker
  const checkWebsiteStatus = async (url: string) => {
    const startTime = Date.now();
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(url, {
        method: 'HEAD',
        mode: 'no-cors',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;
      
      return {
        url,
        status: responseTime > 1000 ? 'slow' : 'online',
        responseTime,
        checking: false
      } as WebsiteStatus;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      // If it failed quickly, it's likely CORS but site is up
      if (responseTime < 100) {
        return {
          url,
          status: 'online',
          responseTime: responseTime,
          checking: false
        } as WebsiteStatus;
      }
      
      return {
        url,
        status: 'offline',
        responseTime: null,
        checking: false
      } as WebsiteStatus;
    }
  };

  // Check all websites periodically
  useEffect(() => {
    const checkAllWebsites = async () => {
      for (const website of websites) {
        const status = await checkWebsiteStatus(website.url);
        setWebsiteStatuses(prev => ({
          ...prev,
          [website.url]: status
        }));
      }
    };

    checkAllWebsites();
    const interval = setInterval(checkAllWebsites, 1000);

    return () => clearInterval(interval);
  }, []);

  // Update document title and favicon
  useEffect(() => {
    document.title = '303 Services / Shop Socials';

    // Update favicon
    const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = '/icon.ico';
    document.getElementsByTagName('head')[0].appendChild(link);
  }, []);

  // Update clock
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const getStatusColor = (status: 'online' | 'slow' | 'offline') => {
    switch (status) {
      case 'online':
        return '#00ff88';
      case 'slow':
        return '#ffaa00';
      case 'offline':
        return '#ff0055';
      default:
        return '#666';
    }
  };

  const getStatusText = (status: WebsiteStatus | undefined) => {
    if (!status || status.checking) return '...';
    if (status.status === 'offline') return '❌ Unavailable';
    if (status.status === 'slow') return '⚠ Slow';
    return '✅ Working';
  };

  const getResponseTimeText = (status: WebsiteStatus | undefined) => {
    if (!status || status.checking || !status.responseTime) return '';
    if (status.responseTime < 100) return `${status.responseTime}ms · Excellent`;
    if (status.responseTime < 500) return `${status.responseTime}ms · Good`;
    return `${status.responseTime}ms · Slow`;
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Animated gradient background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 animate-gradient-flow bg-gradient-to-br from-[#00ff88] via-[#ff0055] to-[#0088ff] opacity-40 blur-3xl"></div>
        <div className="absolute inset-0 animate-gradient-flow-reverse bg-gradient-to-tl from-[#ff4400] via-[#ff0088] to-[#00ff88] opacity-30 blur-3xl" style={{ animationDelay: '-5s' }}></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#ff0088_0%,transparent_50%)] opacity-20 animate-pulse-slow"></div>
      </div>

      {/* Floating particles */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full opacity-60"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: [0.2, 0.8, 0.2]
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      ))}

      {/* Floating blobs */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`blob-${i}`}
          className="absolute rounded-full opacity-20 blur-3xl"
          style={{
            width: Math.random() * 400 + 200,
            height: Math.random() * 400 + 200,
            background: `radial-gradient(circle, ${['#00ff88', '#ff0055', '#0088ff', '#ff4400', '#ff0088'][i]} 0%, transparent 70%)`
          }}
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight
          }}
          animate={{
            x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth, Math.random() * window.innerWidth],
            y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight, Math.random() * window.innerHeight]
          }}
          transition={{
            duration: Math.random() * 20 + 15,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      ))}

      {/* Cursor trail */}
      <motion.div
        ref={cursorTrailRef}
        className="fixed w-8 h-8 rounded-full pointer-events-none z-50 mix-blend-screen"
        style={{
          background: 'radial-gradient(circle, rgba(255,0,136,0.6) 0%, transparent 70%)',
          left: mousePosition.x - 16,
          top: mousePosition.y - 16
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.6, 0.8, 0.6]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      {/* Top right social buttons */}
      <div className="fixed top-6 right-6 z-40 flex gap-4">
        <motion.a
          href="https://discord.gg/UrBksZjjSS"
          target="_blank"
          rel="noopener noreferrer"
          className="relative group"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#5865F2] to-[#7289DA] rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative w-14 h-14 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#5865F2]/20 to-transparent"></div>
            <img src={discordImg} alt="Discord" className="w-8 h-8 relative z-10" />
          </div>
        </motion.a>

        <motion.a
          href="https://t.me/serviices303"
          target="_blank"
          rel="noopener noreferrer"
          className="relative group"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#0088cc] to-[#00aaff] rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative w-14 h-14 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0088cc]/20 to-transparent"></div>
            <img src={telegramImg} alt="Telegram" className="w-8 h-8 relative z-10" />
          </div>
        </motion.a>
      </div>

      {/* Live clock widget */}
      <motion.div
        className="fixed top-6 left-6 z-40 px-6 py-3 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse"></div>
          <span className="text-white/80 text-sm font-mono">
            {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-20">
        {/* Animated floating discord text */}
        <motion.div
          className="absolute top-[35%] right-6 md:right-12 lg:right-20"
          animate={{
            y: [0, -15, 0],
            rotate: [-1, 1, -1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          <div className="relative">
            <div className="absolute inset-0 blur-2xl bg-gradient-to-r from-[#00ff88] to-[#0088ff] opacity-60"></div>
            <h3 className="relative text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-[#00ff88] via-[#0088ff] to-[#ff0088] bg-clip-text text-transparent animate-gradient-x whitespace-nowrap">
              discord.gg/303services
            </h3>
          </div>
        </motion.div>

        {/* Hero section */}
        <motion.div
          className="text-center mb-16 max-w-4xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          style={{
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`
          }}
        >
          <motion.h1
            className="text-6xl md:text-8xl font-black mb-6 relative"
            animate={{
              textShadow: [
                '0 0 20px #00ff88, 0 0 40px #ff0055',
                '0 0 30px #ff0055, 0 0 60px #0088ff',
                '0 0 20px #0088ff, 0 0 40px #00ff88',
                '0 0 20px #00ff88, 0 0 40px #ff0055'
              ]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <span className="bg-gradient-to-r from-[#00ff88] via-[#ff0088] to-[#0088ff] bg-clip-text text-transparent animate-gradient-x">
              303 Services
            </span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-white/70 font-light tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            Premium Socials • Official Websites • Community Access
          </motion.p>

          {/* Online indicator */}
          <motion.div
            className="mt-8 inline-flex items-center gap-3 px-6 py-3 rounded-full bg-black/40 backdrop-blur-xl border border-[#00ff88]/30"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <motion.div
              className="w-3 h-3 rounded-full bg-[#00ff88]"
              animate={{
                boxShadow: ['0 0 10px #00ff88', '0 0 20px #00ff88', '0 0 10px #00ff88']
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
            <span className="text-[#00ff88] font-semibold">COMMUNITY ONLINE</span>
          </motion.div>
        </motion.div>

        {/* Websites grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          {websites.map((website, index) => {
            const status = websiteStatuses[website.url];
            const statusColor = status ? getStatusColor(status.status) : '#666';

            return (
              <motion.div
                key={website.url}
                className="relative group"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Glow effect */}
                <div
                  className="absolute -inset-1 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `linear-gradient(135deg, ${statusColor}, transparent)` }}
                />

                {/* Card */}
                <div className="relative h-full rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 p-6 overflow-hidden">
                  {/* Animated border */}
                  <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div
                      className="absolute inset-0 rounded-3xl"
                      style={{
                        background: `linear-gradient(135deg, ${statusColor}22, transparent)`,
                        animation: 'border-flow 3s linear infinite'
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <span className="text-5xl">{website.emoji}</span>
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">{website.title}</h3>
                          <p className="text-white/60 text-sm">{website.description}</p>
                        </div>
                      </div>

                      {/* Status indicator */}
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2">
                          <motion.div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: statusColor }}
                            animate={{
                              boxShadow: [`0 0 5px ${statusColor}`, `0 0 15px ${statusColor}`, `0 0 5px ${statusColor}`]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: 'easeInOut'
                            }}
                          />
                          <span className="text-xs text-white/80 font-mono">
                            {getStatusText(status)}
                          </span>
                        </div>
                        {status && status.responseTime && (
                          <span className="text-xs text-white/50 font-mono">
                            {getResponseTimeText(status)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Button */}
                    <motion.a
                      href={website.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative block w-full mt-4 px-6 py-3 rounded-xl font-semibold text-center overflow-hidden group/btn"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div
                        className="absolute inset-0 opacity-80 group-hover/btn:opacity-100 transition-opacity"
                        style={{ background: `linear-gradient(135deg, ${statusColor}, ${statusColor}aa)` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-1000" />
                      <span className="relative text-white font-bold">Open Website</span>
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>

      {/* Footer */}
      <motion.footer
        className="relative z-10 py-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <div className="relative inline-block">
          <div className="absolute inset-0 blur-xl bg-gradient-to-r from-[#00ff88] via-[#ff0088] to-[#0088ff] opacity-30" />
          <p className="relative text-white/50 text-sm">
            303 Services © 2026 - Socials
          </p>
        </div>
      </motion.footer>

      <style>{`
        @keyframes gradient-flow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30%, 20%) scale(1.1); }
          66% { transform: translate(-20%, 30%) scale(0.9); }
        }

        @keyframes gradient-flow-reverse {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-30%, -20%) scale(0.9); }
          66% { transform: translate(20%, -30%) scale(1.1); }
        }

        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes spin-slow-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }

        @keyframes border-flow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .animate-gradient-flow {
          animation: gradient-flow 20s ease-in-out infinite;
        }

        .animate-gradient-flow-reverse {
          animation: gradient-flow-reverse 20s ease-in-out infinite;
        }

        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }

        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 15s linear infinite;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.5);
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #00ff88, #ff0088);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #ff0088, #0088ff);
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          cursor: none;
        }

        a, button {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
