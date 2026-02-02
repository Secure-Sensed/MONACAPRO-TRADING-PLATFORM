import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, Globe } from 'lucide-react';
import { toast } from '../hooks/use-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: 'Message Sent!',
      description: 'We will get back to you within 24 hours.'
    });
    
    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'support@monacaptradingpro.com',
      link: 'mailto:support@monacaptradingpro.com'
    },
    {
      icon: Phone,
      title: 'Phone',
      value: '+1 (800) 555-0123',
      link: 'tel:+18005550123'
    },
    {
      icon: MapPin,
      title: 'Address',
      value: '123 Financial District, Sydney, NSW 2000, Australia',
      link: null
    },
    {
      icon: Clock,
      title: 'Support Hours',
      value: '24/7 Live Support',
      link: null
    }
  ];

  const offices = [
    { city: 'Sydney', country: 'Australia', timezone: 'AEST' },
    { city: 'London', country: 'United Kingdom', timezone: 'GMT' },
    { city: 'Toronto', country: 'Canada', timezone: 'EST' },
    { city: 'Singapore', country: 'Singapore', timezone: 'SGT' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0f1f3a] to-[#0a1628] pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Contact <span className="text-cyan-400">Us</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Have questions or need assistance? Our team is here to help you 24/7. Reach out to us through any of the channels below.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-[#1a2942]/80 border-gray-700">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <MessageSquare className="w-6 h-6 text-cyan-400 mr-3" />
                  Send Us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="bg-[#0a1628] border-gray-600 text-white placeholder:text-gray-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-300">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="bg-[#0a1628] border-gray-600 text-white placeholder:text-gray-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-gray-300">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      placeholder="How can we help?"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="bg-[#0a1628] border-gray-600 text-white placeholder:text-gray-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-gray-300">Message</Label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      placeholder="Tell us more about your inquiry..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="w-full bg-[#0a1628] border border-gray-600 text-white placeholder:text-gray-500 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white py-6"
                  >
                    {isSubmitting ? (
                      'Sending...'
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Contact Cards */}
            <div className="grid gap-4">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="bg-[#1a2942]/80 border-gray-700 hover:border-cyan-400/50 transition-all">
                    <CardContent className="p-6 flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <info.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold">{info.title}</h3>
                        {info.link ? (
                          <a href={info.link} className="text-cyan-400 hover:text-cyan-300 transition-colors">
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-gray-400">{info.value}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Global Offices */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="bg-[#1a2942]/80 border-gray-700">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <Globe className="w-5 h-5 text-cyan-400 mr-2" />
                    Global Offices
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {offices.map((office, index) => (
                      <div key={index} className="text-center p-3 bg-[#0a1628]/50 rounded-lg">
                        <p className="text-white font-semibold">{office.city}</p>
                        <p className="text-gray-400 text-sm">{office.country}</p>
                        <p className="text-cyan-400 text-xs mt-1">{office.timezone}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          className="mt-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Frequently Asked <span className="text-cyan-400">Questions</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { q: 'How do I create an account?', a: 'Simply click the Registration button and fill out the form with your details. Verification takes just a few minutes.' },
              { q: 'Is my money safe?', a: 'Yes, we use bank-grade security and keep client funds in segregated accounts with top-tier banks.' },
              { q: 'What are the minimum deposit requirements?', a: 'You can start trading with as little as $250. We accept various payment methods including crypto.' },
              { q: 'How do I withdraw my funds?', a: 'Go to your dashboard, click on Withdraw, and follow the steps. Withdrawals are processed within 24-48 hours.' }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
              >
                <Card className="bg-[#1a2942]/80 border-gray-700 h-full">
                  <CardContent className="p-6">
                    <h4 className="text-white font-bold mb-2">{faq.q}</h4>
                    <p className="text-gray-400">{faq.a}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
