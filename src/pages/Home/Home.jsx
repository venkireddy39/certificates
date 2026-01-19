import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/* Components */
import CourseList from './components/CourseList';
import InstructorList from './components/InstructorList';
import { RevenueChart } from './components/DashboardCharts';
import { Calendar, DollarSign, Users, UserPlus } from 'lucide-react';
import StatCard from '../../components/common/StatCard';

/* Data */
import {
  statsData,
  monthlyRevenueData,
  popularCourses,
  bestInstructors
} from './data';

import './Home.css';

const Home = () => {
  return (
    <div className="dashboard-container">

      <ToastContainer position="top-right" autoClose={3000} />

      {/* ================= STATS GRID ================= */}
      <div className="row g-4 mb-4">

        <div className="col-12 col-md-6 col-xl-3">
          <StatCard
            title="Total Revenue"
            value={`$${statsData.totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            trend="12%"
            trendLabel="vs last month"
            iconBg="#d1fae5"
            iconColor="#059669"
          />
        </div>

        <div className="col-12 col-md-6 col-xl-3">
          <StatCard
            title="Active Students"
            value={statsData.totalStudents.toLocaleString()}
            icon={Users}
            trend="5%"
            trendLabel="vs last month"
            iconBg="#dbeafe"
            iconColor="#2563eb"
          />
        </div>

        <div className="col-12 col-md-6 col-xl-3">
          <StatCard
            title="New Joiners"
            value={statsData.totalSignups}
            icon={UserPlus}
            trend="8%"
            trendLabel="this week"
            iconBg="#fef3c7"
            iconColor="#d97706"
          />
        </div>

        <div className="col-12 col-md-6 col-xl-3">
          <StatCard
            title="Monthly Revenue"
            value={`$${statsData.monthlyRevenue.toLocaleString()}`}
            icon={DollarSign}
            trend="15%"
            trendLabel="vs prev month"
            iconBg="#e0e7ff"
            iconColor="#4f46e5"
          />
        </div>

      </div>

      {/* ================= MAIN CONTENT GRID ================= */}
      <div className="dashboard-content-grid">

        {/* LEFT: POPULAR COURSES */}
        <div className="grid-section-left">
          <CourseList courses={popularCourses} />
        </div>

        {/* CENTER: REVENUE */}
        <div className="grid-section-center">
          <div className="chart-card-clean">
            <div className="chart-header-clean">
              <div>
                <h3>Monthly Revenue</h3>
                <p className="text-muted">This is the latest improvement</p>
              </div>
              <button className="icon-btn-light">
                <Calendar size={16} />
              </button>
            </div>
            <div className="main-chart-wrapper">
              <RevenueChart data={monthlyRevenueData} />
            </div>
          </div>
        </div>

        {/* RIGHT: BEST INSTRUCTORS */}
        <div className="grid-section-right">
          <InstructorList instructors={bestInstructors} />
        </div>

      </div>

    </div>
  );
};

export default Home;
