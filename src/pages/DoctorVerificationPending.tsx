import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Shield, CheckCircle, Mail, Phone } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function DoctorVerificationPending() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-50 to-primary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="bg-yellow-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-10 w-10 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Verification Pending
            </h2>
            <p className="text-gray-600">
              Thank you for registering as a doctor with HealthConnect!
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-start text-left">
              <div className="flex-shrink-0 mt-1">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                </div>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">Application Submitted</h3>
                <p className="text-sm text-gray-600">Your doctor registration has been received</p>
              </div>
            </div>

            <div className="flex items-start text-left">
              <div className="flex-shrink-0 mt-1">
                <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Shield className="h-4 w-4 text-yellow-600" />
                </div>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">Under Review</h3>
                <p className="text-sm text-gray-600">Our team is verifying your credentials</p>
              </div>
            </div>

            <div className="flex items-start text-left">
              <div className="flex-shrink-0 mt-1">
                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-500">Approval Notification</h3>
                <p className="text-sm text-gray-500">You'll receive an email when approved</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-medium text-blue-900 mb-2">What happens next?</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Our medical verification team will review your documents</li>
              <li>• We may contact you for additional information</li>
              <li>• Verification typically takes 2-3 business days</li>
              <li>• You'll receive an email notification once approved</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Link to="/">
              <Button variant="outline" className="w-full">
                Return to Homepage
              </Button>
            </Link>
            
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Need help with your application?</p>
              <div className="flex items-center justify-center space-x-4 text-sm">
                <a 
                  href="mailto:verification@healthconnect.com" 
                  className="flex items-center text-primary-600 hover:text-primary-700"
                >
                  <Mail className="h-4 w-4 mr-1" />
                  Email Support
                </a>
                <a 
                  href="tel:+233-XX-XXX-XXXX" 
                  className="flex items-center text-primary-600 hover:text-primary-700"
                >
                  <Phone className="h-4 w-4 mr-1" />
                  Call Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}