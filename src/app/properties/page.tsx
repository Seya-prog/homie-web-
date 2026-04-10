"use client";

import { useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";

const properties = [
  {
    id: 1,
    name: "Skyline Heights Residences",
    address: "422 West 15th St, Manhattan, NY",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBRMKgLPAYjs1VYMiUQ_wJrnHTBTBboh0jdp-E3pS3QyvW-dtTDLUrajgY420XQHoLT4eP8VOCCIoHJ6fuwsJcjVvz-wgB2sh0RuMoHv9ZU863Mk94qHWc_ZYAhfsygpYJKUL6f5e8sffNK6qT-ObYZvuPFwPzXQKY39wWWqGtk7T5D59jbQ_CWVyRVcgXkE31b-wxnRVTDF0UcA1Jbb4UWZc_cThBzWEPNzH_zbMSqLMRFWcQGLxgzZTZsGQ7Sce-Vho26ppH0cTaa",
    status: "Leased",
    statusColor: "#002a1a",
    statusTextColor: "#ffffff",
    rent: "$4,200",
    occupancy: "100%",
    occupancyColor: "#002446",
    requests: "0",
    requestsColor: "#002446",
  },
  {
    id: 2,
    name: "Coastal Azure Estate",
    address: "882 Ocean Drive, Malibu, CA",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD96OxOzdwp3owmWZtIRM9OAMcy5nHxsVt9t-tdZR-WlfwfqAfl2SAwGvj5zXtXLblG9oBX6jBwOzaMmcHJYIXvkjK-7Jp-mstiDPdKatNJdjIQsp9Go23-kb0WDhFbFf-by-yXvLsgB0lTSHpZbmy91PFA2dZmX-ZDm777jTCcOdqB9-Cjls4Z0GuwkFKhb6O1DwsFM1DdFglG4h6UfHdXYcvD0m7AmTX9R-CIXqpy9eSJX5GrJTTu2jfXlwh8wULFVVQrkdwFemyq",
    status: "Vacant",
    statusColor: "#e1e3e4",
    statusTextColor: "#191c1d",
    rent: "$8,500",
    occupancy: "0%",
    occupancyColor: "#ba1a1a",
    requests: "2",
    requestsColor: "#002446",
  },
  {
    id: 3,
    name: "The Heritage Lofts",
    address: "102 Industrial Ave, Austin, TX",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDaIG3tyGazDPpXVdGaF2Nt5MDd4bPvCIuJ8I_deyuuXlGP-YrWHo1uHFd8Ybhw6ryzwXA6mg2lk937ZSOVbsgo0SKyR00GbcX3o3qt4isBx3umeOmeKUCWXrmeb6yzAjrHVcaOcy2aYC8SiUwgKncKl_xVZF4WF8tzTS4P0yuVyXsYZYMfYKNyVOF5n43jIuzM14Eb0prBpZKuLnRL-Jb4un-lBZkkEwq0DJzq7gUbHEU7dU4BbvLxBtOPdoYRGcGMF6bjdTN6IrBG",
    status: "Urgent Maintenance",
    statusColor: "#ba1a1a",
    statusTextColor: "#ffffff",
    rent: "$3,100",
    occupancy: "85%",
    occupancyColor: "#002446",
    requests: "12",
    requestsColor: "#ba1a1a",
  },
  {
    id: 4,
    name: "Nordic Pine Retreat",
    address: "99 Silver Spruce, Aspen, CO",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-8TzGiz7SEB4SpLiz4yPoMVUP8Fo5KcPRyOyNHrUGM6rjFYIDilLWjzVXZgbbD_9CNAjemIhYaqwUUC2b2PCr9C41Bc5tlBotBi0JRsqOdJFZGh1DYxJW2nUEzMoCL1VjMP73gNxUMpU_Zaljw_DwoWol9UMml1N1pn7_vhP04j8BwK7hqlGxi5uCZMdTkhzmdwgnuof0jKmhmY6usHM06qW3Eesi2dxToMXGtVfm5JOkUyxU_U1xvdAqH6beEg2hfBca8bJWBh8C",
    status: "Leased",
    statusColor: "#002a1a",
    statusTextColor: "#ffffff",
    rent: "$5,600",
    occupancy: "100%",
    occupancyColor: "#002446",
    requests: "1",
    requestsColor: "#002446",
  },
];

const filters = ["All Properties", "Leased", "Vacant", "Maintenance"];

export default function PropertiesPage() {
  const [activeFilter, setActiveFilter] = useState("All Properties");
  return (
    <div className="flex" style={{ background: '#f8f9fa', color: '#191c1d', height: '100vh', overflow: 'hidden' }}>
      <Sidebar role="owner" activePage="My Properties" />

      <div className="flex-1 flex flex-col min-w-0" style={{ height: '100vh', overflowY: 'auto' }}>
        {/* Top Header with Search */}
        <header
          className="flex justify-between items-center w-full"
          style={{
            padding: '0 32px',
            height: '64px',
            position: 'sticky',
            top: 0,
            zIndex: 40,
            backgroundColor: '#f8f9fa',
            borderBottom: '1px solid #f1f5f9',
          }}
        >
          <div className="flex items-center flex-1" style={{ gap: '16px' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '28rem' }}>
              <span
                className="material-symbols-outlined"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '18px' }}
              >
                search
              </span>
              <input
                type="text"
                placeholder="Search properties..."
                style={{
                  width: '100%',
                  backgroundColor: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  paddingLeft: '40px',
                  paddingRight: '16px',
                  paddingTop: '8px',
                  paddingBottom: '8px',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>
          </div>
          <div className="flex items-center" style={{ gap: '24px' }}>
            <div className="flex items-center" style={{ gap: '8px' }}>
              <button
                style={{ padding: '8px', color: '#64748b', borderRadius: '9999px', position: 'relative', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <span className="material-symbols-outlined">notifications</span>
                <span style={{ position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px', backgroundColor: '#914d00', borderRadius: '9999px', border: '2px solid #f8f9fa' }} />
              </button>
              <button
                style={{ padding: '8px', color: '#64748b', borderRadius: '9999px', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <span className="material-symbols-outlined">help</span>
              </button>
            </div>
            <div style={{ height: '32px', width: '1px', backgroundColor: '#e2e8f0' }} />
            <div className="flex items-center" style={{ gap: '12px' }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '14px', fontWeight: 700, color: '#002446', lineHeight: '1.2' }}>Alexander Holm</p>
                <p style={{ fontSize: '12px', color: '#64748b' }}>Premium Owner</p>
              </div>
              <img
                alt="Owner Profile"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5lUGmVCpeOK2ZaLiFy-jOhZnEmJrXiLTX5oFP48QM4i9Tu-NvmjjYRvj2cCnM0wtp2y3guj9To7kLdjbR3Akp27jyYOkvyu73THW5VonIbY2DSe-zq0C04xBPaBpxUU6lp0M8YfHhS9msw0l7BnWvnMMS47dWcasj_30z_RLkKt9o0xDhvI2kFPyXd8CHz9MpXWaos_bgXRU46Rv6rLmV65s6pR0YpFF-rBCs3WeHucf9n0PYAqbbBAo3wddeE75kt5LPKPaqb8tK"
                style={{ width: '40px', height: '40px', borderRadius: '9999px', objectFit: 'cover', border: '2px solid #ffffff', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
              />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Page Header */}
          <section style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '24px' }}>
            <div>
              <h2
                className="font-headline"
                style={{ fontSize: '2.25rem', fontWeight: 800, color: '#002446', letterSpacing: '-0.025em', marginBottom: '8px' }}
              >
                My Properties
              </h2>
              <div className="flex items-center" style={{ gap: '12px' }}>
                <span
                  style={{
                    padding: '4px 12px',
                    backgroundColor: '#1a3a5f',
                    color: '#87a4cf',
                    borderRadius: '9999px',
                    fontSize: '12px',
                    fontWeight: 700,
                  }}
                >
                  24 Total Properties
                </span>
                <span style={{ color: '#9ca3af', fontSize: '14px' }}>•</span>
                <span style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>Updated 2 hours ago</span>
              </div>
            </div>
            <Link
              href="/properties/new"
              className="flex items-center font-bold hover:opacity-90 transition-all"
              style={{
                gap: '8px',
                backgroundColor: '#002446',
                color: '#ffffff',
                padding: '12px 24px',
                borderRadius: '12px',
                fontSize: '14px',
                textDecoration: 'none',
                boxShadow: '0 4px 6px rgba(0,36,70,0.1)',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
              <span>Add New Property</span>
            </Link>
          </section>

          {/* Filters */}
          <section>
            <div
              style={{
                backgroundColor: '#f3f4f5',
                padding: '6px',
                borderRadius: '12px',
                display: 'inline-flex',
                gap: '4px',
              }}
            >
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: activeFilter === filter ? 700 : 600,
                    backgroundColor: activeFilter === filter ? '#ffffff' : 'transparent',
                    color: activeFilter === filter ? '#002446' : '#64748b',
                    boxShadow: activeFilter === filter ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {filter}
                </button>
              ))}
            </div>
          </section>

          {/* Property Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
            {properties.map((prop) => (
              <Link
                href={`/properties/${prop.id}`}
                key={prop.id}
                className="group"
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1px solid #f8fafc',
                  transition: 'box-shadow 0.3s',
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                {/* Image */}
                <div style={{ position: 'relative', height: '224px', overflow: 'hidden' }}>
                  <img
                    alt={prop.name}
                    src={prop.image}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                    className="group-hover:scale-105"
                  />
                  <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
                    <span
                      style={{
                        padding: '4px 12px',
                        backgroundColor: prop.statusColor,
                        color: prop.statusTextColor,
                        fontSize: '10px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        borderRadius: '6px',
                      }}
                    >
                      {prop.status}
                    </span>
                  </div>
                  {prop.status === "Leased" && (
                    <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
                      <button
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '9999px',
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          backdropFilter: 'blur(12px)',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>favorite</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <h3
                      className="font-headline"
                      style={{ fontSize: '1.25rem', fontWeight: 700, color: '#002446', marginBottom: '4px' }}
                    >
                      {prop.name}
                    </h3>
                    <div className="flex items-center" style={{ gap: '4px', color: '#9ca3af' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>location_on</span>
                      <span style={{ fontSize: '12px', fontWeight: 500 }}>{prop.address}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 1fr',
                      gap: '8px',
                      padding: '16px 0',
                      borderTop: '1px solid #f8fafc',
                      borderBottom: '1px solid #f8fafc',
                    }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: '10px', color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: '4px' }}>Rent</p>
                      <p style={{ fontSize: '14px', fontWeight: 900, color: '#002446' }}>{prop.rent}</p>
                    </div>
                    <div style={{ textAlign: 'center', borderLeft: '1px solid #f8fafc', borderRight: '1px solid #f8fafc' }}>
                      <p style={{ fontSize: '10px', color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: '4px' }}>Occupancy</p>
                      <p style={{ fontSize: '14px', fontWeight: 900, color: prop.occupancyColor }}>{prop.occupancy}</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: '10px', color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: '4px' }}>Requests</p>
                      <p style={{ fontSize: '14px', fontWeight: 900, color: prop.requestsColor }}>{prop.requests}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 'auto', paddingTop: '16px' }}>
                    <span
                      style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid #002446',
                        backgroundColor: 'transparent',
                        color: '#002446',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        textAlign: 'center',
                      }}
                    >
                      View Details
                    </span>
                    <button
                      style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: '#fc9430',
                        color: '#663500',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      Manage Leases
                    </button>
                  </div>
                </div>
              </Link>
            ))}

            {/* Add New Property Placeholder Card */}
            <Link
              href="/properties/new"
              className="group"
              style={{
                border: '2px dashed #cbd5e1',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '32px',
                backgroundColor: 'rgba(248,250,252,0.5)',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'all 0.2s',
              }}
            >
              <div
                className="group-hover:scale-110 transition-transform"
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(171,200,245,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '30px', color: '#002446' }}>add_home</span>
              </div>
              <p style={{ color: '#002446', fontWeight: 700 }}>Add Property</p>
              <p style={{ fontSize: '12px', color: '#64748b', textAlign: 'center', marginTop: '8px', maxWidth: '160px' }}>
                List a new asset to your Homie portfolio
              </p>
            </Link>
          </div>
        </main>

        {/* Footer */}
        <footer style={{ padding: '32px', textAlign: 'center', color: '#9ca3af', fontSize: '12px', marginTop: 'auto' }}>
          <p>© 2024 Homie Estate Management System. All portfolio data is encrypted.</p>
        </footer>
      </div>
    </div>
  );
}
