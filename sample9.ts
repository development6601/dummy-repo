// library.ts

interface Borrowable {
    borrow(user: string): void;
    returnItem(): void;
    isBorrowed(): boolean;
}

abstract class LibraryItem implements Borrowable {
    protected title: string;
    protected id: string;
    protected borrowed: boolean = false;
    protected borrowedBy: string | null = null;

    constructor(title: string, id: string) {
        this.title = title;
        this.id = id;
    }

    abstract displayInfo(): void;

    borrow(user: string): void {
        if (this.borrowed) {
            throw new Error("Item is already borrowed.");
        }
        this.borrowed = true;
        this.borrowedBy = user;
    }

    returnItem(): void {
        this.borrowed = false;
        this.borrowedBy = null;
    }

    isBorrowed(): boolean {
        return this.borrowed;
    }

    getTitle(): string {
        return this.title;
    }

    getId(): string {
        return this.id;
    }
}

class Book extends LibraryItem {
    private author: string;

    constructor(title: string, id: string, author: string) {
        super(title, id);
        this.author = author;
    }

    displayInfo(): void {
        console.log(`Book: ${this.title} by ${this.author} [ID: ${this.id}] - ${this.borrowed ? `Borrowed by ${this.borrowedBy}` : "Available"}`);
    }
}

class DVD extends LibraryItem {
    private duration: number;

    constructor(title: string, id: string, duration: number) {
        super(title, id);
        this.duration = duration;
    }

    displayInfo(): void {
        console.log(`DVD: ${this.title} (${this.duration} mins) [ID: ${this.id}] - ${this.borrowed ? `Borrowed by ${this.borrowedBy}` : "Available"}`);
    }
}

class LibraryUser {
    constructor(public name: string, public userId: string) {}
}

class Library {
    private items: LibraryItem[] = [];
    private users: LibraryUser[] = [];

    addItem(item: LibraryItem): void {
        this.items.push(item);
    }

    addUser(user: LibraryUser): void {
        this.users.push(user);
    }

    findItemById(id: string): LibraryItem | undefined {
        return this.items.find(item => item.getId() === id);
    }

    findUserById(id: string): LibraryUser | undefined {
        return this.users.find(user => user.userId === id);
    }

    borrowItem(itemId: string, userId: string): void {
        const item = this.findItemById(itemId);
        const user = this.findUserById(userId);

        if (!item || !user) {
            console.log("Invalid item or user ID.");
            return;
        }

        try {
            item.borrow(user.name);
            console.log(`${user.name} borrowed "${item.getTitle()}"`);
        } catch (e: any) {
            console.log(`Error: ${e.message}`);
        }
    }

    returnItem(itemId: string): void {
        const item = this.findItemById(itemId);
        if (!item) {
            console.log("Item not found.");
            return;
        }
        item.returnItem();
        console.log(`${item.getTitle()} has been returned.`);
    }

    listItems(): void {
        this.items.forEach(item => item.displayInfo());
    }
}

// --- CLI Interface using readline ---
import * as readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const library = new Library();
library.addUser(new LibraryUser("Alice", "U1"));
library.addUser(new LibraryUser("Bob", "U2"));

library.addItem(new Book("1984", "B1", "George Orwell"));
library.addItem(new Book("The Hobbit", "B2", "J.R.R. Tolkien"));
library.addItem(new DVD("Inception", "D1", 148));
library.addItem(new DVD("The Matrix", "D2", 136));

function menu(): void {
    console.log(`\nLibrary System Menu:
1. List Items
2. Borrow Item
3. Return Item
4. Exit`);
    rl.question("Enter your choice: ", choice => {
        switch (choice) {
            case "1":
                library.listItems();
                menu();
                break;
            case "2":
                rl.question("Enter Item ID: ", itemId => {
                    rl.question("Enter User ID: ", userId => {
                        library.borrowItem(itemId, userId);
                        menu();
                    });
                });
                break;
            case "3":
                rl.question("Enter Item ID to return: ", itemId => {
                    library.returnItem(itemId);
                    menu();
                });
                break;
            case "4":
                console.log("Goodbye!");
                rl.close();
                break;
            default:
                console.log("Invalid choice.");
                menu();
                break;
        }
    });
}

menu();
