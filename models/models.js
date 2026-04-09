const sequelize = require('../config/db')
const {DataTypes} = require('sequelize')

// ========== Модель User (Пользователь) ==========
const User = sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },    
    role: {
        type: DataTypes.ENUM(
            // Вариант 1: Article
            'USER', 'MODERATOR', 'ADMIN',
            // Вариант 2: Product
            'SELLER', 'BUYER',
            // Вариант 3: Comment
            'VIP_USER',
            // Вариант 4: Order
            'CLIENT', 'COOK', 'MANAGER',
            // Вариант 5: Task
            'EMPLOYEE', 'TEAM_LEAD', 'DIRECTOR',
            // Вариант 6: Booking
            'GUEST', 'RECEPTION',
            // Вариант 7: Lesson
            'STUDENT', 'TEACHER',
            // Вариант 8: Transaction
            'AUDITOR',
            // Вариант 9: Post
            'AUTHOR', 'EDITOR', 'READER',
            // Вариант 10: Ticket
            'CUSTOMER', 'SUPPORT_AGENT', 'SUPERVISOR',
            // Вариант 11: Playlist
            'PREMIUM_USER',
            // Вариант 12: Appointment
            'PATIENT', 'DOCTOR',
        ),
        defaultValue: 'USER',
        allowNull: false
    }
});


// ========== Вариант 1. Article (Статья) ==========
const Article = sequelize.define('article', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false }
});

// ========== Вариант 2. Product (Товар) ==========
const Product = sequelize.define('product', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    stock: { type: DataTypes.INTEGER, defaultValue: 0 },
    sellerId: { type: DataTypes.INTEGER, allowNull: false }
});

// ========== Вариант 3. Comment (Комментарий) ==========
const Comment = sequelize.define('comment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    text: { type: DataTypes.TEXT, allowNull: false },
    videoId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false }
});

// ========== Вариант 4. Order (Заказ) ==========
const Order = sequelize.define('order', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    items: { type: DataTypes.JSON, allowNull: false }, // [{name, price, quantity}]
    totalPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    status: { 
        type: DataTypes.ENUM('pending', 'cooking', 'ready', 'delivered'),
        defaultValue: 'pending'
    },
    userId: { type: DataTypes.INTEGER, allowNull: false }
});

// ========== Вариант 5. Task (Задача) ==========
const Task = sequelize.define('task', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    isCompleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    projectId: { type: DataTypes.INTEGER, allowNull: false },
    assigneeId: { type: DataTypes.INTEGER, allowNull: false }
});

// ========== Вариант 6. Booking (Бронирование отеля) ==========
const Booking = sequelize.define('booking', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    roomNumber: { type: DataTypes.INTEGER, allowNull: false },
    dateStart: { type: DataTypes.DATEONLY, allowNull: false },
    dateEnd: { type: DataTypes.DATEONLY, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false }
});

// ========== Вариант 7. Lesson (Урок) ==========
const Lesson = sequelize.define('lesson', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    videoUrl: { type: DataTypes.STRING, allowNull: false },
    courseId: { type: DataTypes.INTEGER, allowNull: false },
    teacherId: { type: DataTypes.INTEGER, allowNull: false }
});

// ========== Вариант 8. Transaction (Финансовая операция) ==========
const Transaction = sequelize.define('transaction', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    type: { 
        type: DataTypes.ENUM('income', 'expense'),
        allowNull: false
    },
    walletId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false }
});

// ========== Вариант 9. Post (Пост в блоге) ==========
const Post = sequelize.define('post', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    tags: { type: DataTypes.JSON, defaultValue: [] }, // массив строк
    authorId: { type: DataTypes.INTEGER, allowNull: false }
});

// ========== Вариант 10. Ticket (Тикет поддержки) ==========
const Ticket = sequelize.define('ticket', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    problem: { type: DataTypes.TEXT, allowNull: false },
    status: {
        type: DataTypes.ENUM('open', 'in_progress', 'closed'),
        defaultValue: 'open'
    },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    supportId: { type: DataTypes.INTEGER, allowNull: true } // может быть null, если не назначен
});

// ========== Вариант 11. Playlist (Плейлист) ==========
const Playlist = sequelize.define('playlist', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    isPublic: { type: DataTypes.BOOLEAN, defaultValue: false },
    songsIds: { type: DataTypes.JSON, defaultValue: [] }, // массив ID песен
    creatorId: { type: DataTypes.INTEGER, allowNull: false }
});

// ========== Вариант 12. Appointment (Запись к врачу) ==========
const Appointment = sequelize.define('appointment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    doctorId: { type: DataTypes.INTEGER, allowNull: false },
    patientId: { type: DataTypes.INTEGER, allowNull: false },
    dateTime: { type: DataTypes.DATE, allowNull: false },
    symptoms: { type: DataTypes.TEXT, allowNull: false }
});

module.exports = {
    User,
    Appointment,
    Article,
    Product,
    Comment,
    Ticket,
    Playlist,
    Post,
    Transaction,
    Lesson,
    Booking,
    Task,
    Order

}