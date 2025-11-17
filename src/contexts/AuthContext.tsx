import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Company, Employee } from '../utils';

interface AuthContextType {
  user: User | null;
  employee: Employee | null;
  company: Company | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  path: string | null;
  login: (employeeId: string, password: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [path, setPath] = useState<string | null>(null);

  // Check for valid stored authentication
  const hasValidStoredAuth = () => {
    try {
      const savedUser = localStorage.getItem('hrms_user');
      const savedToken = localStorage.getItem('hrms_token');
      
      // Check if we have the essential data
      if (!savedUser || !savedToken) {
        return false;
      }

      const userData = JSON.parse(savedUser);

      // Basic validation - check if required fields exist
      const hasValidUser = !!(userData && userData.token);
      
      return hasValidUser;
    } catch (error) {
      console.error('Error checking stored auth:', error);
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = () => {
      try {
        if (hasValidStoredAuth()) {
          const savedUser = localStorage.getItem('hrms_user');
          const savedToken = localStorage.getItem('hrms_token');

          if (savedUser) setUser(JSON.parse(savedUser));
          if (savedToken) setToken(savedToken);
          setIsAuthenticated(true);
        } else {
          // Clear any corrupted/incomplete data
          clearAuthData();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const clearAuthData = () => {
    setUser(null);
    setEmployee(null);
    setCompany(null);
    setIsAuthenticated(false);
    setToken(null);
    setPath(null);
    
    // Clear all auth-related localStorage items
    localStorage.removeItem('hrms_user');
    localStorage.removeItem('hrms_employee');
    localStorage.removeItem('hrms_company');
    localStorage.removeItem('hrms_cookies');
    localStorage.removeItem('hrms_token');
    localStorage.removeItem('hrms_path');
  };

  const login = async (employeeId: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Make login request to n8n webhook
      const loginResponse = await fetch('https://n8n.gopocket.in/webhook/referral', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usr: employeeId,
          pwd: password
        })
      });

      const responseData = await loginResponse.json();
      console.log('Login response:', responseData);

      // Handle failed login response
      if (Array.isArray(responseData) && responseData.length > 0) {
        const firstItem = responseData[0];
        if (firstItem.status === "FAILED") {
          throw new Error('Wrong Backoffice password');
        }
      }

      if (!loginResponse.ok) {
        const errorMessage = responseData.message || responseData.exc || responseData.error || `Authentication failed with status ${loginResponse.status}`;
        throw new Error(errorMessage);
      }

      if (responseData.exc) {
        throw new Error('Invalid employee ID or password');
      }

      // Extract login data from response (could be array or object)
      const loginData = Array.isArray(responseData) ? responseData[0] : responseData;

      // Check if we have the required data in the response
      if (!loginData.token || !loginData.role || !loginData.clientid) {
        throw new Error('Authentication failed. Please check your Client Code & Backoffice password.');
      }

      // Determine user role based on the response role
      let userRole: User['role'] = 'employee';
      const responseRole = loginData.role.toLowerCase();
      
      if (responseRole === 'admin' || responseRole === 'superadmin') {
        userRole = responseRole as User['role'];
      } else if (responseRole === 'manager') {
        userRole = 'manager';
      } else if (responseRole === 'hr') {
        userRole = 'hr';
      }

      // Create user data from the API response
      const userData: User = {
        id: loginData.clientid,
        employeeId: loginData.clientid,
        email: '',
        firstName: '',
        lastName: '',
        role: loginData.role,
        companyId: 'gopocket',
        avatar: '/lovable-uploads/e80701e6-7295-455c-a88c-e3c4a1baad9b.png',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        token: loginData.token,
        path: '',
        team: '',
        hierarchy: '',
        clientid: loginData.clientid
      };

      // Set state - only user and token
      setUser(userData);
      setEmployee(null); // Clear employee data
      setCompany(null); // Clear company data
      setIsAuthenticated(true);
      setToken(loginData.token);
      setPath(null); // Clear path
      
      // Save to localStorage - only user and token
      localStorage.setItem('hrms_user', JSON.stringify(userData));
      localStorage.setItem('hrms_token', loginData.token);
      
      // Clear other localStorage items that are no longer needed
      localStorage.removeItem('hrms_employee');
      localStorage.removeItem('hrms_company');
      localStorage.removeItem('hrms_path');
      
    } catch (error) {
      console.error('Login error:', error);
      clearAuthData();
      
      if (error instanceof Error) {
        throw error;
      } else if (typeof error === 'string') {
        throw new Error(error);
      } else {
        throw new Error('Authentication failed. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {   
    // Immediately clear local data
    clearAuthData();
  };

  const switchRole = (role: string) => {
    if (user) {
      const updatedUser = { ...user, role: role as User['role'] };
      setUser(updatedUser);
      localStorage.setItem('hrms_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      employee,
      company,
      isAuthenticated,
      isLoading,
      token,
      path,
      login,
      logout,
      switchRole,
    }}>
      {children}
    </AuthContext.Provider>
  );
};