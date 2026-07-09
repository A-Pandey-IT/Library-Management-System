import { useState, useEffect } from "react";

import AdminManagementPage from "./AdminManagementPage";
import AddAdminForm from "../forms/AddAdminForm";

import ChangePasswordPage from "./ChangePasswordPage";

import MemberDashboard from "./MemberDashboard";

import MemberLoginPage from "./MemberLoginPage";

import LoginPage from "./LoginPage";

import HomeDashboard from "./HomeDashboard";

import TransactionsPage from "./TransactionPage";

import PurchasePage from "./PurchasePage";

import PurchaseDetails from "../forms/PurchaseDetails";

import PurchaseBookForm from "../forms/PurchaseBookForm";

import IssuesPage from "./IssuePage";

import ReturnBookForm from "../forms/ReturnBookForm";

import BooksPage from "./BooksPage";

import AddBookForm from "../forms/AddBookForm";

import EditBookForm from "../forms/EditBookForm";

import BookHistory from "../forms/BookHistory";

import api from "../services/api";

import UsersPage from "./UsersPage";

import Modal from "../components/Modal";

import Header from "../components/Header";

import Sidebar from "../components/Sidebar";

import AddStudentForm from "../forms/AddStudentForm";

import IssueBookForm from "../forms/IssueBookForm";

import ChangePasswordForm from "../forms/ChangePasswordForm";

import EditStudentForm from "../forms/EditStudentForm";

import StudentHistory from "../forms/StudentHistory";

import LoadingSpinner from "../components/LoadingSpinner";

function DashboardPage({

    isLoggedIn,
    setIsLoggedIn,

    userType,
    setUserType,

    role,
    setRole

}) {

    const forcePasswordChange =
        localStorage.getItem(
            "forcePasswordChange"
        ) === "true";

    if (
        userType === "member" &&
        forcePasswordChange
    ) {
        return (
            <ChangePasswordPage />
        );
    }

    const [
        showAddAdminModal,
        setShowAddAdminModal
    ] = useState(false);

    const [showMemberLogin,
    setShowMemberLogin] =
    useState(false);

    const [
    showPurchaseModal,
    setShowPurchaseModal
    ] = useState(false);

    const [
    selectedPurchase,
    setSelectedPurchase
] = useState(null);

    const [
    showPurchaseDetails,
    setShowPurchaseDetails
    ] = useState(false);

    const [
    showReturnModal,
    setShowReturnModal
    ] = useState(false);

    const [
    selectedIssue,
    setSelectedIssue
    ] = useState(null);

    const [selectedBook,
    setSelectedBook] =
    useState(null);


    const [showEditBookModal,
    setShowEditBookModal] =
    useState(false);

    const [showBookHistoryModal,
    setShowBookHistoryModal] =
    useState(false);

    const [showAddBookModal,
    setShowAddBookModal] =
    useState(false);

    const [
        showChangePassword,
        setShowChangePassword
    ] = useState(false);

    const logout = () => {

        localStorage.clear();
        

        setRole(null);
        setUserType("guest");
        setSidebarOpen(false);
        setIsLoggedIn(false);

        setRefreshData(prev => !prev);
        window.location.reload();
    };

    const [showEditModal,
    setShowEditModal] =
    useState(false);

    const [showHistoryModal,
    setShowHistoryModal] =
    useState(false);

    const [selectedStudent, setSelectedStudent] =
    useState(null);

    const [showIssueModal, setShowIssueModal] =
    useState(false);

    const [refreshData,
    setRefreshData] =
    useState(false);

    const [showModal, setShowModal] =
    useState(false);

    const [sidebarOpen, setSidebarOpen] =
        useState(false);

    const [activePage, setActivePage] =
        useState("dashboard");

    const [showLogin, setShowLogin] =
        useState(false);

    const [darkMode, setDarkMode] =
        useState(
            localStorage.getItem(
                "darkMode"
            ) === "true"
        );

    const toggleDarkMode =
        () => {
        const newMode =
            !darkMode;
            setDarkMode(newMode);

        localStorage.setItem(
            "darkMode",
            newMode
        );

        if (newMode) {

    document.documentElement.classList.add(
        "dark"
    );

} else {

    document.documentElement.classList.remove(
        "dark"
    );
}
    };

    useEffect(() => {

    if (
        activePage ===
        "changePassword"
    ) {

        setShowChangePassword(
            true
        );

    }

    }, [activePage]);


    const handleDelete =
        async (studentId) => {

            const confirmDelete =
                window.confirm(
                    "Delete this student?"
                );

            if(!confirmDelete) return;

            try{

                

                await api.delete(
                    `/students/${studentId.id}`
                );

                alert(
                    "Student deleted"
                );

                setRefreshData(prev => !prev)

            }catch(error){

                alert(
                    error.response?.data?.message
                );
            }
        }

    const handleDeleteBook =
    async (book) => {

        const confirmDelete =
            window.confirm(
                `Delete "${book.title}" ?`
            );

        if (!confirmDelete) {
            return;
        }

        try {

            await api.delete(
                `/books/${book.id}`
            );

            alert(
                "Book deleted successfully"
            );

            setRefreshData(
                prev => !prev
            );

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Failed to delete book"
            );
        }
    };

    const handleDeleteAdmin = async (admin) => {

        const confirmDelete =
            window.confirm(
                `Delete ${admin.username}?`
            );

    if (!confirmDelete) return;
        try {
            await api.delete(
                `/admin/${admin.id}`
            );
            alert(
                "Admin deleted."
            );
            setRefreshData(
                prev => !prev
            );
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Delete failed."
            );
        }
    };

    if (loading) {
        return (
            <LoadingSpinner />
        );
    }

    return (
        <>
        <div
            className="
                min-h-screen
                bg-gray-100
                dark:bg-gray-900
                dark:text-white
            "
        >

            <Sidebar
                isOpen={sidebarOpen}

                isLoggedIn={isLoggedIn}

                userType={userType}

                role={role}

                setActivePage={setActivePage}

                closeSidebar={() =>
                    setSidebarOpen(false)
                }

                logout={logout}

                onLogin={() =>
                    setShowLogin(true)
                }

                onMemberLogin={()=>
                    setShowMemberLogin(true)
                }
            />

            <Header
                toggleSidebar={() =>
                    setSidebarOpen(true)
                }
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
                activePage={activePage}

                onAddMember={() =>{
                    if (userType !== "staff"){
                        return;
                    }

                    if(activePage === "users"){
                        setShowModal(true);
                    }

                    else if (activePage === "books"){
                        setShowAddBookModal(true);
                    } 

                    else if(activePage === "purchase"){
                        setShowPurchaseModal(true);
                    }
                }}
            />

            <main
                className="
                    p-6
                "
            >

                {
                    isLoggedIn &&
                    userType === "staff" &&
                    activePage === "users" &&

                    <UsersPage
                        refreshData={refreshData}
                        onIssueBook={(student) => {
                            setSelectedStudent(student);
                            setShowIssueModal(true);
                        }}

                        onEditStudent={(student) => {
                            setSelectedStudent(student);
                            setShowEditModal(true);
                        }}

                        onViewHistory={(student) => {
                            setSelectedStudent(student);
                            setShowHistoryModal(true);
                        }}

                        onDeleteStudent={handleDelete}
                    />
                }

                {
                    isLoggedIn &&
                    userType === "staff"  &&
                    activePage === "books" &&
                    < BooksPage 
                        refreshData={refreshData}
                        onEditBook={(book) =>{
                            setSelectedBook(book);
                            setShowEditBookModal(true);
                        }}
                        onViewHistory={(book)=>{
                            setSelectedBook(book);
                            setShowBookHistoryModal(true);
                        }}

                        onDeleteBook={handleDeleteBook}
                    />
                }

                {
                    isLoggedIn &&            
                    activePage === "issues" &&
                    <IssuesPage
                        userType={userType}
                        refreshData={refreshData}
                        onReturnBook={(issue)=>{
                            setSelectedIssue(issue);
                            setShowReturnModal(true);
                        }}
                    />
                }

                {
                    isLoggedIn &&
                    userType === "staff"  &&
                    activePage === "purchase" &&
                    <PurchasePage 
                        refreshData={refreshData}
                        onViewPurchase={(purchase) =>{
                            setSelectedPurchase(purchase);
                            setShowPurchaseDetails(true);
                        }}
                    />
                }

                {
                    activePage === "transactions" &&
                    <TransactionsPage 
                        userType={userType}
                    />
                }

                {
                    activePage === "dashboard" && (

                        isLoggedIn
                            ? (
                                userType === "member"
                                    ? <MemberDashboard />
                                    : <HomeDashboard />
                                )
                            : (
                                <div
                                    className="
                                        bg-white
                                        dark:bg-gray-800
                                        rounded-lg
                                        shadow
                                        mt-15
                                        p-8
                                    "
                                >

                                    <h1
                                        className="
                                            text-3xl
                                            font-bold
                                            mb-4
                                        "
                                    >
                                        Welcome to
                                        Library Management
                                        System
                                    </h1>

                                    <p
                                        className="
                                            text-gray-600
                                            dark:text-gray-300
                                        "
                                    >
                                        You are currently
                                        using Guest Mode.
                                    </p>

                                    <p
                                        className="
                                            mt-4
                                        "
                                    >
                                        Login with your Staff or 
                                        Member account to access 
                                        library services.
                                    </p>

                                </div>
                            )

                        )
                }

                {

                    userType === "staff" &&
                    role === "LIBRARIAN" &&
                    activePage === "admins" &&

                    <AdminManagementPage
                        refreshData={refreshData}
                        onAddAdmin={() =>
                            setShowAddAdminModal(true)
                        }
                        onDeleteAdmin={handleDeleteAdmin}
                    />
                }

            </main>
            <Modal
                isOpen={isLoggedIn && showModal}
                title="Add Member"
                onClose={() =>
                    setShowModal(false)
                }
            >

                <AddStudentForm
                    onClose={()=>
                        setShowModal(false)
                    }
                    onSuccess={()=>
                        setRefreshData(prev => !prev)
                    }
                >

                </AddStudentForm>

            </Modal>

            <Modal
                isOpen={
                    isLoggedIn && 
                    showIssueModal
                }
                title="Issue Book"
                onClose={() => {

                    setShowIssueModal(
                        false
                    );

                    setSelectedStudent(
                        null
                    );
                }}
            >

                <IssueBookForm
                    student={
                        selectedStudent
                    }
                    onClose={() => {

                        setShowIssueModal(
                            false
                        );

                        setSelectedStudent(
                            null
                        );
                    }}
                    onSuccess={() => {

                        setRefreshData(prev => !prev);
                    }}
                />

            </Modal>

            <Modal
                isOpen={isLoggedIn && showEditModal}
                title="Edit Student"
                onClose={() =>
                    setShowEditModal(false)
                }
            >

                <EditStudentForm
                    student={selectedStudent}

                    onClose={() =>
                        setShowEditModal(false)
                    }

                    onSuccess={() =>
                        setRefreshData(
                            prev => !prev
                        )
                    }
                />

            </Modal>

            <Modal
                isOpen={
                    isLoggedIn &&
                    showHistoryModal}
                    title="Student History"
                    onClose={() =>
                    setShowHistoryModal(false)
                }
            >

                <StudentHistory
                    student={selectedStudent}
                />

            </Modal>

            <Modal
                isOpen={
                    isLoggedIn && 
                    showChangePassword
                }
                title="Change Password"
                onClose={() =>{
                    setShowChangePassword(false);
                    if(userType === "member"){
                        setActivePage("dashboard");
                    } else{
                        setActivePage("users");
                    }
                }
                    
                }
            >

                <ChangePasswordForm
                    endpoint={
                        userType === "member"
                            ? "/member/changeUserPassword"
                            : "/admin/change-password"
                    }
                    buttonText="Update Password"
                    onSuccess={() => {

                        localStorage.clear();

                        window.location.reload();

                    }}
                />

            </Modal>

            <Modal
                isOpen={isLoggedIn && showAddBookModal}
                title="Add Book"
                onClose={() =>
                    setShowAddBookModal(false)
                }
            >

                <AddBookForm
                    onClose={() =>
                        setShowAddBookModal(false)
                    }
                    onSuccess={() =>
                        setRefreshData(
                            prev => !prev
                        )
                    }
                />

            </Modal>

            <Modal
                isOpen={isLoggedIn && showEditBookModal}
                title="Edit Book"
                onClose={() =>
                    setShowEditBookModal(false)
                }
            >

            <EditBookForm
                    book={selectedBook}
                    onClose={() =>
                        setShowEditBookModal(false)
                    }
                    onSuccess={() =>
                        setRefreshData(
                            prev => !prev
                        )
                    }
                />

            </Modal>

            <Modal
                isOpen={isLoggedIn && showBookHistoryModal}
                title="Book History"
                onClose={() =>
                    setShowBookHistoryModal(false)
                }
            >

                <BookHistory
                    book={selectedBook}
                />

            </Modal>

            <Modal
                isOpen={isLoggedIn && showReturnModal}
                title="Return Book"
                onClose={()=>{
                    setShowReturnModal(false);
                    setSelectedIssue(null);
                }}
            >

                <ReturnBookForm
                    issue={selectedIssue}
                    onClose={()=>{
                        setShowReturnModal(false);
                        setSelectedIssue(null);
                    }}
                    onSuccess={()=>{
                        setRefreshData(prev=>!prev);
                    }}

                />

            </Modal>

            <Modal
                isOpen={showPurchaseModal}
                title="Purchase Book"
                onClose={() =>
                    setShowPurchaseModal(false)
                }
            >

                <PurchaseBookForm
                    onClose={() =>
                        setShowPurchaseModal(false)
                    }
                    onSuccess={() =>
                        setRefreshData(
                            prev => !prev
                        )
                    }
                />

            </Modal>

            <Modal
                isOpen={
                    showPurchaseDetails
                }
                title="Purchase Details"
                onClose={() => {

                    setShowPurchaseDetails(
                        false
                    );

                    setSelectedPurchase(
                        null
                    );
                }}
            >

                <PurchaseDetails
                    purchase={
                        selectedPurchase
                    }
                />

            </Modal>

            <Modal
                isOpen={
                    showLogin
                }
                title="Staff Login"
                onClose={() =>
                    setShowLogin(false)
                }
            >

                <LoginPage
                    setIsLoggedIn={(value) => {

                            setIsLoggedIn(value);

                            setUserType(
                                localStorage.getItem("userType")
                            );

                            setRole(localStorage.getItem("role"));

                            setShowLogin(false);

                        }
                    }
                />

            </Modal>

            <Modal
                isOpen={showMemberLogin}
                title="Member Login"
                onClose={() =>
                    setShowMemberLogin(false)
                }
            >

                <MemberLoginPage
                    setIsLoggedIn={(value) => {

                        setIsLoggedIn(value);

                        setUserType(
                            localStorage.getItem("userType")
                        );

                        setRole(
                            localStorage.getItem("role")
                        );

                    }}

                    onSuccess={()=> {
                        setShowMemberLogin(false)
                    }}
                />

            </Modal>

            <Modal

                isOpen={showAddAdminModal}
                title="Add Admin"
                onClose={() =>

                    setShowAddAdminModal(false)
                }
            >

                <AddAdminForm
                    onClose={() =>
                        setShowAddAdminModal(false)
                    }
                    onSuccess={() =>
                        setRefreshData(
                            prev => !prev
                        )
                    }
                />
            </Modal>

        </div>
        </>
    );
}

export default DashboardPage;