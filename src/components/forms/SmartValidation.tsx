import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface ValidationRule {
  test: (value: string) => boolean;
  message: string;
  type: 'error' | 'warning' | 'success';
}

interface SmartInputProps {
  label: string;
  type?: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  rules?: ValidationRule[];
  autoComplete?: string;
  suggestions?: string[];
  className?: string;
}

export const SmartInput = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  rules = [],
  autoComplete,
  suggestions = [],
  className = ''
}: SmartInputProps) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [validationResults, setValidationResults] = useState<{ rule: ValidationRule; passed: boolean }[]>([]);

  // Filter suggestions based on input value
  useEffect(() => {
    if (value && suggestions.length > 0) {
      const filtered = suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0 && focused);
    } else {
      setShowSuggestions(false);
    }
  }, [value, suggestions, focused]);

  // Validate input
  useEffect(() => {
    const results = rules.map(rule => ({
      rule,
      passed: rule.test(value)
    }));
    setValidationResults(results);
  }, [value, rules]);

  const hasErrors = validationResults.some(result => result.rule.type === 'error' && !result.passed);
  const hasWarnings = validationResults.some(result => result.rule.type === 'warning' && !result.passed);
  const isValid = validationResults.length > 0 && !hasErrors && !hasWarnings;

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className={`relative ${className}`}>
      <Label htmlFor={label} className="text-sm font-medium text-foreground mb-2 block">
        {label}
      </Label>
      
      <div className="relative">
        <Input
          id={label}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          autoComplete={autoComplete}
          className={`
            pr-10 transition-all duration-200
            ${focused ? 'ring-2 ring-primary/50 border-primary' : ''}
            ${hasErrors ? 'border-danger ring-danger/50' : ''}
            ${hasWarnings ? 'border-warning ring-warning/50' : ''}
            ${isValid ? 'border-success ring-success/50' : ''}
          `}
        />
        
        {/* Password toggle */}
        {type === 'password' && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        )}
        
        {/* Validation indicator */}
        {value && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            {hasErrors && (
              <XCircle className="h-4 w-4 text-danger" />
            )}
            {hasWarnings && !hasErrors && (
              <AlertCircle className="h-4 w-4 text-warning" />
            )}
            {isValid && (
              <CheckCircle className="h-4 w-4 text-success" />
            )}
          </div>
        )}
        
        {/* Suggestions dropdown */}
        <AnimatePresence>
          {showSuggestions && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-md shadow-lg z-50 max-h-48 overflow-y-auto"
            >
              {filteredSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => {
                    onChange(suggestion);
                    setShowSuggestions(false);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground transition-colors text-sm"
                >
                  {suggestion}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Validation messages */}
      <AnimatePresence>
        {validationResults.some(result => !result.passed) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 space-y-1"
          >
            {validationResults.map((result, index) => (
              !result.passed && (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-2 text-xs ${
                    result.rule.type === 'error' ? 'text-danger' :
                    result.rule.type === 'warning' ? 'text-warning' :
                    'text-success'
                  }`}
                >
                  {result.rule.type === 'error' && <XCircle className="h-3 w-3" />}
                  {result.rule.type === 'warning' && <AlertCircle className="h-3 w-3" />}
                  {result.rule.type === 'success' && <CheckCircle className="h-3 w-3" />}
                  {result.rule.message}
                </motion.div>
              )
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Common validation rules
export const validationRules = {
  required: (message = 'This field is required'): ValidationRule => ({
    test: (value) => value.trim().length > 0,
    message,
    type: 'error'
  }),
  
  email: (message = 'Please enter a valid email address'): ValidationRule => ({
    test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message,
    type: 'error'
  }),
  
  minLength: (min: number, message?: string): ValidationRule => ({
    test: (value) => value.length >= min,
    message: message || `Must be at least ${min} characters`,
    type: 'error'
  }),
  
  maxLength: (max: number, message?: string): ValidationRule => ({
    test: (value) => value.length <= max,
    message: message || `Must be no more than ${max} characters`,
    type: 'error'
  }),
  
  pattern: (regex: RegExp, message: string): ValidationRule => ({
    test: (value) => regex.test(value),
    message,
    type: 'error'
  }),
  
  strongPassword: (message = 'Password must contain uppercase, lowercase, number, and special character'): ValidationRule => ({
    test: (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(value),
    message,
    type: 'error'
  }),
  
  phone: (message = 'Please enter a valid phone number'): ValidationRule => ({
    test: (value) => /^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/\D/g, '')),
    message,
    type: 'error'
  }),
  
  ssn: (message = 'Please enter a valid SSN (XXX-XX-XXXX)'): ValidationRule => ({
    test: (value) => /^\d{3}-\d{2}-\d{4}$/.test(value),
    message,
    type: 'error'
  }),
  
  positiveNumber: (message = 'Must be a positive number'): ValidationRule => ({
    test: (value) => !isNaN(Number(value)) && Number(value) > 0,
    message,
    type: 'error'
  }),
  
  businessName: (message = 'Business name should be 2-100 characters'): ValidationRule => ({
    test: (value) => value.length >= 2 && value.length <= 100,
    message,
    type: 'warning'
  }),
  
  domain: (message = 'Please enter a valid domain name'): ValidationRule => ({
    test: (value) => /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(value),
    message,
    type: 'error'
  })
};