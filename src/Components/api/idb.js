// Developers details: Omer Norman 206729873 , Yarin Rahamim 205833668

const idb = {
  openCostsDB: function (dbName = "costs", vesrion = 1) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, vesrion);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        const objectStore = db.createObjectStore("costsManager", {
          keyPath: "id",
          autoIncrement: true,
        });
        objectStore.createIndex("costItem", "costItem", { unique: false });
        objectStore.createIndex("sum", "sum", { unique: false });
        objectStore.createIndex("description", "description", {
          unique: false,
        });
        objectStore.createIndex("category", "category", {
          unique: false,
        });
        objectStore.createIndex("date", "date", { unique: false });
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  },
  addCost: function (data) {
    return new Promise((resolve, reject) => {
      this.openCostsDB() // Use 'this' to call the method
        .then((db) => {
          let currentYear;
          let currentMonth;
          const transaction = db.transaction(["costsManager"], "readwrite");
          const objectStore = transaction.objectStore("costsManager");
          if (!data.date) {
            const currentDate = new Date();
            currentMonth = String(currentDate.getMonth() + 1).padStart(2, "0");
            currentYear = currentDate.getFullYear();
            data.date = `${currentYear}-${currentMonth}`;
          }
          const addRequest = objectStore.add(data);

          addRequest.onsuccess = () => {
            resolve(addRequest.result);
          };

          addRequest.onerror = () => {
            reject(addRequest.error);
          };

          transaction.oncomplete = () => {
            db.close();
          };
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  getReport: function (yearMonth) {
    return new Promise((resolve, reject) => {
      this.openCostsDB()
        .then((db) => {
          const transaction = db.transaction(["costsManager"], "readonly");
          const objectStore = transaction.objectStore("costsManager");
          const index = objectStore.index("date"); // assuming you've created an index on the 'date' attribute
          const request = index.getAll(IDBKeyRange.only(yearMonth));
          request.onsuccess = () => {
            console.log(request.result);
            resolve(request.result);
          };
          request.onerror = () => {
            reject(request.error);
          };
          transaction.oncomplete = () => {
            db.close();
          };
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};
export default idb;
