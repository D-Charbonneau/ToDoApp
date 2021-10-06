const KEY = "Lists";
let listIndex;


window.onload = function()
{
    if(window.localStorage.getItem(KEY) != undefined)
    {
        let old = JSON.parse(window.localStorage.getItem(KEY));
    
        for(let i = 0; i < old.lists.length; i++)
        {
            listContainer.addList(old.lists[i].listName, true);
            
            for(let j = 0; j < old.lists[i].items.length; j++)
            {
                listContainer.getList(i).addItem(old.lists[i].items[j].name, old.lists[i].items[j].desc, true, old.lists[i].items[j].finished);
                listContainer.getList(i).getItem(j).finished = old.lists[i].items[j].finished;
            }
        }
    }
}

function createList()
{
    let listInput = document.getElementById("listName");
    if(listInput.value != "")
    {
        listContainer.addList(listInput.value);
        listInput.value = "";
    }
}


function chooseList(index)
{
    
    if(listIndex == undefined)
    {
        document.getElementById("addItem").style.display = "flex";
    }
    else
    {
        document.getElementById("list" + listIndex).classList.remove("active");
    }
    listIndex = index;
    document.getElementById("list" + listIndex).classList.add("active");
    listContainer.getList(listIndex).render();
}

function addToList()
{
    let nameInput = document.getElementById("itemName");
    let descInput = document.getElementById("itemDesc");
    if(nameInput.value != "")
    {
        listContainer.getList(listIndex).addItem(nameInput.value, descInput.value);
        nameInput.value = "";
        descInput.value = "";
        listContainer.getList(listIndex).render();
    }
}

function toggleActive(index)
{
    if(!listContainer.getList(listIndex).getItem(index).finished)
    {
        document.getElementById("i" + index).classList.remove("fa-times");
        document.getElementById("i" + index).classList.add("fa-check");
    }
    else
    {
        document.getElementById("i" + index).classList.remove("fa-check");
        document.getElementById("i" + index).classList.add("fa-times");
    }
    listContainer.getList(listIndex).getItem(index).finished = !listContainer.getList(listIndex).getItem(index).finished;
    save();
}

function Clear()
{
    listContainer.clearItems();
    save();
}

class ListContainer
{
    constructor()
    {
        this.listID = 0;
        this.lists = [];
    }

    addList(listName, loading = false)
    {
        this.lists.push(new List(listName, this.listID++));
        this.render();
        if(!loading)
        {
            save();
        }
    }

    getList(index)
    {
        return this.lists[index];
    }

    listLists()
    {
        for(let i = 0; i < this.lists.length; i++)
        {
            console.log(this.lists[i].listName);
            this.lists[i].listAllItems();
        }
    }
    render()
    {
        let nav = document.getElementById("lists");
        nav.innerHTML = "";
        for(let i = 0; i < this.lists.length; i++)
        {
            if(i == listIndex)
            {
                nav.innerHTML += `<a id="list${i}" class="active" onclick="chooseList(${i})">${this.lists[i].listName}</a>`;
            }
            else
            {
                nav.innerHTML += `<a id="list${i}" class="" onclick="chooseList(${i})">${this.lists[i].listName}</a>`;
            }
        }
        save();
    }

    clearItems()
    {
        if(listIndex != undefined)
        {
            for(let i = 0; i < this.lists.length; i++)
            {
                this.lists[i].clearFinished();
            }
            listContainer.getList(listIndex).render();
        }
    }
}

function devList()
{
    listContainer.addList("FirstList");
    listContainer.addList("SecondList");
    listContainer.addList("ThirdList");
    listContainer.getList(0).addItem("Hi there");
    listContainer.getList(0).addItem("I am in a list");
    listContainer.getList(0).addItem("You are not in a list");
    listContainer.getList(0).addItem("Final entry of list one");
    listContainer.getList(1).addItem("Hi");
    listContainer.getList(1).addItem("Ok");
    listContainer.getList(1).addItem("No");
    listContainer.getList(2).addItem("Testing");
    listContainer.getList(2).addItem("Last entry of the third list");
}


class List
{
    constructor(listName, listID)
    {
        this.listName = listName;
        this.listID = listID;
        this.itemID = 0;
        this.items = [];
    }
    
    addItem(name, desc, loading = false, finished = false)
    {
        this.items.push(new ToDoItem(name, desc, this.itemID++, finished));
        if(!loading)
        {
            save();
        }
    }

    getItem(index)
    {
        return this.items[index];
    }

    listAllItems(num = 0)
    {
        for(let i = 0; i < this.items.length; i++)
        {
            console.log("- " + this.items[i].name + "\n- - (" + this.items[i].desc + ")");
        }
    }

    clearFinished()
    {
        for(let i = this.items.length-1; i >= 0; i--)
        {
            if(this.items[i].finished)
            {
                this.items.splice(i, 1);
            }
        }
    }

    render()
    {
        let display = document.getElementById("listDisplay");
        display.innerHTML = "";
        for(let i = 0; i < this.items.length; i++)
        {
            if(this.items[i].finished)
            {
                display.innerHTML += `<div class="listItem" id="${i}"><i class="fa fa-check" id="i${i}" onclick="toggleActive(${i})"></i><p><b>${this.items[i].name}</b></p></div>`;
            }
            else
            {
                display.innerHTML += `<div class="listItem" id="${i}"><i class="fa fa-times" id="i${i}" onclick="toggleActive(${i})"></i><p><b>${this.items[i].name}</b></p></div>`;
            }
        }
        save();
    }
}

class ToDoItem
{
    constructor(name, desc, id, finished = false)
    {
        this.id = id;
        this.name = name;
        this.desc = desc;
        this.finished = finished;
    }

    getID() 
    {
        return this.id;
    }

    setValues(name, desc)
    {
        this.name = name;
        this.desc = desc;
    }
}

function save()
{
    window.localStorage.setItem(KEY, JSON.stringify(listContainer));
}

let listContainer = new ListContainer();