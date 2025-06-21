'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowRight,
  Play,
  Users,
  TrendingUp,
  Sparkles,
  Zap,
  Target,
} from 'lucide-react';
import { CheckoutModal } from '@/components/checkout-modal';
import { motion } from 'framer-motion';

export function EnhancedHeroSection() {
  const [showCheckout, setShowCheckout] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-20 sm:px-6 lg:px-8">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20"
          variants={floatingVariants}
          animate="animate"
        />
        <motion.div
          className="absolute top-40 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-20"
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 1 }}
        />
        <motion.div
          className="absolute bottom-40 left-1/4 w-12 h-12 bg-green-200 rounded-full opacity-20"
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 2 }}
        />
      </div>

      <motion.div
        className="relative mx-auto max-w-7xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="text-center">
          <motion.div variants={itemVariants}>
            <Badge
              variant="secondary"
              className="mb-6 px-6 py-3 text-sm font-medium"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Trusted by 50,000+ Job Seekers Worldwide
            </Badge>
          </motion.div>

          <motion.h1
            className="mx-auto max-w-5xl text-5xl font-bold tracking-tight text-gray-900 sm:text-7xl lg:text-8xl"
            variants={itemVariants}
          >
            Master Your
            <motion.span
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 5,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'linear',
              }}
            >
              {' '}
              Dream Job{' '}
            </motion.span>
            Interview
          </motion.h1>

          <motion.p
            className="mx-auto mt-8 max-w-3xl text-xl leading-8 text-gray-600 sm:text-2xl"
            variants={itemVariants}
          >
            Experience realistic company hiring rounds with AI-powered
            simulations. Practice with{' '}
            <span className="font-semibold text-blue-600">
              Amazon, Google, Microsoft
            </span>{' '}
            and 50+ top-tier companies.
          </motion.p>

          <motion.div
            className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row"
            variants={itemVariants}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                className="px-10 py-6 text-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => setShowCheckout(true)}
              >
                <Zap className="mr-3 h-6 w-6" />
                Get Hiring Guru Prime
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="lg"
                className="px-10 py-6 text-xl font-semibold border-2 hover:bg-gray-50 transition-all duration-300"
              >
                <Play className="mr-3 h-6 w-6" />
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3"
            variants={containerVariants}
          >
            <motion.div
              className="flex flex-col items-center group cursor-pointer"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="rounded-full bg-gradient-to-r from-blue-500 to-blue-600 p-4 shadow-lg group-hover:shadow-xl transition-all duration-300"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Users className="h-10 w-10 text-white" />
              </motion.div>
              <h3 className="mt-6 text-2xl font-bold">50+ Companies</h3>
              <p className="text-gray-600 text-lg">Real hiring processes</p>
            </motion.div>

            <motion.div
              className="flex flex-col items-center group cursor-pointer"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="rounded-full bg-gradient-to-r from-purple-500 to-purple-600 p-4 shadow-lg group-hover:shadow-xl transition-all duration-300"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Target className="h-10 w-10 text-white" />
              </motion.div>
              <h3 className="mt-6 text-2xl font-bold">5 Round Types</h3>
              <p className="text-gray-600 text-lg">Complete simulation</p>
            </motion.div>

            <motion.div
              className="flex flex-col items-center group cursor-pointer"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="rounded-full bg-gradient-to-r from-green-500 to-green-600 p-4 shadow-lg group-hover:shadow-xl transition-all duration-300"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <TrendingUp className="h-10 w-10 text-white" />
              </motion.div>
              <h3 className="mt-6 text-2xl font-bold">95% Success Rate</h3>
              <p className="text-gray-600 text-lg">Job placement success</p>
            </motion.div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            className="mt-16 flex flex-wrap justify-center items-center gap-8 opacity-60"
            variants={itemVariants}
          >
            <div className="text-sm font-medium text-gray-500">
              TRUSTED BY CANDIDATES FROM
            </div>
            <div className="flex gap-6 items-center">
              <div className="px-4 py-2 bg-white rounded-lg shadow-sm border">
                Google
              </div>
              <div className="px-4 py-2 bg-white rounded-lg shadow-sm border">
                Amazon
              </div>
              <div className="px-4 py-2 bg-white rounded-lg shadow-sm border">
                Microsoft
              </div>
              <div className="px-4 py-2 bg-white rounded-lg shadow-sm border">
                Meta
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <CheckoutModal open={showCheckout} onOpenChange={setShowCheckout} />
    </section>
  );
}
