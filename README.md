

## **Emeris - Satellite Tracker**

A real-time satellite tracking application that visualises orbital data and displays satellite positions and coverage in a clean and intuitive interface. Perfect for casual observers and space enthusiasts alike!  

---

### **Features**:

• **Real-Time Tracking:** View the live position and movement of satellites.  

• **Orbital Calculations:** See satellite paths and trajectories with dynamic visualisations.  

• **Coverage Analysis:** Analyse satellite coverage areas and visibility.  

• **Search & Filter:** Easily find specific satellites or filter by custom criteria.  

### Watch the [**demo**](https://youtu.be/AK4iwkDWlOw)  

---

### **Emeris is built with:**

#### **Frontend:**  
![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=black) ![Leaflet.js](https://img.shields.io/badge/-Leaflet.js-199900?logo=leaflet&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/-TailwindCSS-06B6D4?logo=tailwindcss&logoColor=white)  

#### **Backend:**  
![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=nodedotjs&logoColor=white) ![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?logo=mongodb&logoColor=white)  

#### **Tools:**  
![Satellite.js](https://img.shields.io/badge/-Satellite.js-333333?logoColor=white) ![Vite](https://img.shields.io/badge/-Vite-646CFF?logo=vite&logoColor=white)  

---

### **Getting Started**

Follow these instructions to set up and run the project locally.

**1. Clone the Repository**

```
git clone https://github.com/tomghaines/emeris.git
```

---

**2. Install Dependencies**

```
npm install
```

---

**3. Create a MongoDB Database**

> Sign up for a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or set up a local MongoDB instance.

Create a new database (e.g., satelliteDB) and a collection (e.g., satellites).  

---

**4. Populate the Database**

```
npm run fetch-data
```

---

**5. Update Environment Variables**

Create a ``.env`` file in the root directory with your MongoDB URI:

```
_MONGO_URI=your-mongodb-uri
```

---

### **Author**

Tom Haines - [GitHub](https://github.com/tomghaines) - [LinkedIn](https://www.linkedin.com/in/tom-haines-5755462b4/)

