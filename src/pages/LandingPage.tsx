import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Shield, Users, MapPin, CheckCircle, Star, ArrowRight, Stethoscope, Award, UserCheck, Building2, Clock, FileText, Phone, Pill, Package, Truck, HeadphonesIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 to-medical-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Connect with 
                <span className="text-primary-600"> Verified Doctors</span> in Your Community
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Get reliable health information, ask questions about your anonymously, and book consultations 
                with certified medical professionals across diverse health areas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button size="lg" className="w-full sm:w-auto">
                    Join Our Community
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=2"
                alt="Doctor consultation"
                className="rounded-lg shadow-2xl w-full"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="bg-green-100 p-2 rounded-full">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">500+ Verified Doctors</p>
                    <p className="text-sm text-gray-600">Ready to help you</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Healthcare Made Accessible
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform bridges the gap between patients and healthcare professionals, 
              making quality medical advice accessible to everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-lg bg-gradient-to-br from-primary-50 to-primary-100">
              <div className="bg-primary-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Community-Driven Q&A</h3>
              <p className="text-gray-600 leading-relaxed">
                Ask health questions anonymously or publicly and get answers from our verified 
                medical professionals. Learn from others' experiences in a safe environment.
              </p>
            </div>

            <div className="text-center p-8 rounded-lg bg-gradient-to-br from-medical-50 to-medical-100">
              <div className="bg-medical-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Verified Medical Experts</h3>
              <p className="text-gray-600 leading-relaxed">
                All our doctors are thoroughly verified and licensed professionals. Get reliable, 
                evidence-based medical advice you can trust.
              </p>
            </div>

            <div className="text-center p-8 rounded-lg bg-gradient-to-br from-yellow-50 to-yellow-100">
              <div className="bg-yellow-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Local Testing Centers</h3>
              <p className="text-gray-600 leading-relaxed">
                Find nearby testing facilities and diagnostic centers. Book appointments and 
                get the medical tests you need close to home.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Doctors Section */}
      <section className="py-20" style={{ backgroundColor: '#FDC300' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Verified Doctors
            </h2>
            <p className="text-xl text-gray-800 max-w-3xl mx-auto">
              Join our network of trusted medical professionals and make a difference in your community's health
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-white p-3 rounded-full shadow-md">
                    <Shield className="h-6 w-6 text-gray-900" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Rigorous Verification Process</h3>
                    <p className="text-gray-800">
                      We thoroughly verify all medical credentials, licenses, and certifications to ensure 
                      only qualified professionals join our platform.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-white p-3 rounded-full shadow-md">
                    <Users className="h-6 w-6 text-gray-900" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Expand Your Reach</h3>
                    <p className="text-gray-800">
                      Connect with patients across your region and beyond. Provide consultations and 
                      answer health questions from the comfort of your practice.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-white p-3 rounded-full shadow-md">
                    <Award className="h-6 w-6 text-gray-900" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Build Your Reputation</h3>
                    <p className="text-gray-800">
                      Showcase your expertise, earn patient reviews, and build a strong professional 
                      reputation in the digital healthcare space.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-white p-3 rounded-full shadow-md">
                    <Stethoscope className="h-6 w-6 text-gray-900" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Flexible Practice</h3>
                    <p className="text-gray-800">
                      Set your own consultation fees, choose your availability, and practice 
                      telemedicine on your terms while helping more patients.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-white rounded-lg shadow-xl p-8">
                <div className="bg-gray-900 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <UserCheck className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Join Our Network?</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Become part of a trusted community of medical professionals dedicated to 
                  improving healthcare accessibility across developing regions.
                </p>
                <div className="space-y-4">
                  <div className="text-sm text-gray-500 space-y-2">
                    <div className="flex items-center justify-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Free registration for verified doctors</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Set your own consultation rates</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>24/7 platform support</span>
                    </div>
                  </div>
                  <Link to="/doctor-signup">
                    <Button size="lg" className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                      Register as a Doctor
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <p className="text-xs text-gray-500">
                    Registration requires medical license verification
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Access to Accredited Test Centers Section */}
      <section className="py-20 bg-gradient-to-br from-teal-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Access to Accredited Test Centers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Partner with us to provide essential diagnostic services and expand your reach to patients who need reliable testing facilities
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="bg-white rounded-lg shadow-xl p-8">
                <div className="bg-teal-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto lg:mx-0 mb-6">
                  <Building2 className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Join Our Testing Network</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Become a trusted diagnostic partner and help patients access quality testing services 
                  in their communities. Increase your visibility and patient base through our platform.
                </p>
                <div className="space-y-4">
                  <div className="text-sm text-gray-500 space-y-2">
                    <div className="flex items-center justify-center lg:justify-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-teal-600" />
                      <span>Free listing for accredited centers</span>
                    </div>
                    <div className="flex items-center justify-center lg:justify-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-teal-600" />
                      <span>Online appointment booking system</span>
                    </div>
                    <div className="flex items-center justify-center lg:justify-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-teal-600" />
                      <span>Patient review and rating system</span>
                    </div>
                    <div className="flex items-center justify-center lg:justify-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-teal-600" />
                      <span>Digital result delivery integration</span>
                    </div>
                  </div>
                  <Button size="lg" className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                    Register Your Test Center
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <p className="text-xs text-gray-500 text-center lg:text-left">
                    Accreditation and licensing verification required
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-white p-3 rounded-full shadow-md">
                    <Shield className="h-6 w-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Assurance</h3>
                    <p className="text-gray-600">
                      All testing centers undergo thorough accreditation verification to ensure they meet 
                      the highest standards for diagnostic accuracy and patient safety.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-white p-3 rounded-full shadow-md">
                    <Clock className="h-6 w-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Streamlined Booking</h3>
                    <p className="text-gray-600">
                      Patients can easily find and book appointments at your facility through our 
                      integrated scheduling system, reducing administrative overhead.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-white p-3 rounded-full shadow-md">
                    <FileText className="h-6 w-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Digital Integration</h3>
                    <p className="text-gray-600">
                      Seamlessly integrate with our platform to provide digital test results, 
                      appointment confirmations, and patient communication tools.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-white p-3 rounded-full shadow-md">
                    <Phone className="h-6 w-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Support</h3>
                    <p className="text-gray-600">
                      Get dedicated support for platform integration, patient management, and 
                      technical assistance whenever you need it.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Access to Pharmacies Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Access to Pharmacies
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect patients with trusted pharmacies for convenient medication access and prescription fulfillment
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-white p-3 rounded-full shadow-md">
                    <Pill className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Prescription Management</h3>
                    <p className="text-gray-600">
                      Streamline prescription fulfillment with digital prescriptions from verified doctors, 
                      ensuring accurate medication dispensing and patient safety.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-white p-3 rounded-full shadow-md">
                    <Package className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Inventory Management</h3>
                    <p className="text-gray-600">
                      Manage your medication inventory efficiently with real-time stock updates, 
                      automated reorder alerts, and demand forecasting tools.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-white p-3 rounded-full shadow-md">
                    <Truck className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Delivery Services</h3>
                    <p className="text-gray-600">
                      Offer convenient home delivery options for patients, expanding your service area 
                      and providing essential medications to those who need them most.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-white p-3 rounded-full shadow-md">
                    <HeadphonesIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Patient Counseling</h3>
                    <p className="text-gray-600">
                      Provide medication counseling and consultation services through our platform, 
                      helping patients understand their treatments and improve adherence.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center lg:text-right">
              <div className="bg-white rounded-lg shadow-xl p-8">
                <div className="bg-purple-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto lg:mx-auto mb-6">
                  <Pill className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Partner with HealthConnect</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Join our network of trusted pharmacies and help patients access essential medications 
                  with convenience and confidence. Expand your reach and grow your business.
                </p>
                <div className="space-y-4">
                  <div className="text-sm text-gray-500 space-y-2">
                    <div className="flex items-center justify-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-purple-600" />
                      <span>Free registration for licensed pharmacies</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-purple-600" />
                      <span>Digital prescription processing</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-purple-600" />
                      <span>Delivery management system</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-purple-600" />
                      <span>Customer review platform</span>
                    </div>
                  </div>
                  <Button size="lg" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                    Register Your Pharmacy
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <p className="text-xs text-gray-500">
                    Pharmacy license and certification verification required
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How HealthConnect Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Getting quality healthcare advice has never been easier. Follow these simple steps 
              to connect with medical professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                title: 'Sign Up',
                description: 'Create your free account and join our healthcare community'
              },
              {
                step: '2',
                title: 'Ask Questions',
                description: 'Post your health questions anonymously or publicly'
              },
              {
                step: '3',
                title: 'Get Answers',
                description: 'Receive expert responses from verified doctors'
              },
              {
                step: '4',
                title: 'Book Consultations',
                description: 'Schedule paid one-on-one consultations when needed'
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-gray-600">
              See what our community members say about HealthConnect
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah M.',
                role: 'Patient',
                content: 'HealthConnect helped me understand my symptoms before visiting a doctor. The community is supportive and the doctors are very knowledgeable.',
                rating: 5
              },
              {
                name: 'Dr. James K.',
                role: 'General Practitioner',
                content: 'I love being able to help patients across the region. The platform makes it easy to share medical knowledge and provide quality care.',
                rating: 5
              },
              {
                name: 'Michael T.',
                role: 'Patient',
                content: 'Found a great testing center near me through the app. The verification system gives me confidence in the recommendations.',
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of patients and doctors who are already part of our healthcare community. 
            Your health journey starts here.
          </p>
          <div className="flex justify-center">
            <Link to="/signup">
              <Button variant="outline" size="lg" className="border-2 border-white text-primary-600 bg-white hover:bg-gray-100">
                Join Our Community
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}