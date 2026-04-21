import fs from 'fs';
import path from 'path';

const apiDir = 'c:/Users/Admin/Desktop/SOP-Final/sop/src/app/api';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const modelMappings = {
  Checklist: 'ChecklistModel',
  Equipment: 'EquipmentModel',
  Prototype: 'PrototypeModel',
  NewAssignment: 'AssignmentModel',
};

walkDir(apiDir, (filePath) => {
  if (!filePath.endsWith('.js')) return;
  let content = fs.readFileSync(filePath, 'utf-8');
  
  if (content.includes('getTenantModel')) {
    // 1. Remove import getTenantModel
    content = content.replace(/import\s*\{\s*getTenantModel\s*\}\s*from\s*(['"])@\/utils\/tenantDb\1;?\n?/g, '');
    
    // 2. Add static model imports at the top
    const newImports = `
import ChecklistStatic from "@/model/ChecklistNew";
import EquipmentStatic from "@/model/Equipment";
import PrototypeStatic from "@/model/Task";
import AssignmentStatic from "@/model/NewAssignment";
import CompanyStatic from "@/model/Company";
`;
    // Find last import
    const lastImportIndex = content.lastIndexOf('import ');
    if (lastImportIndex !== -1) {
      const endOfImport = content.indexOf('\n', lastImportIndex);
      content = content.slice(0, endOfImport + 1) + newImports + content.slice(endOfImport + 1);
    } else {
      content = newImports + content;
    }

    // 3. Replace dynamic definition
    // getTenantModel("Checklist", companyId)
    // Actually, let's just intercept it via a local abstraction
    const tenantReplacement = `
    const getTenantStaticModel = (name) => {
       if (name === "Checklist") return ChecklistStatic;
       if (name === "Equipment") return EquipmentStatic;
       if (name === "Prototype") return PrototypeStatic;
       if (name === "NewAssignment") return AssignmentStatic;
       return null;
    };
`;
    // Not optimal. Let's do exact regex replacements:
    // const Model = getTenantModel("X", companyId); -> const Model = XStatic;
    content = content.replace(/const\s+(\w+)\s*=\s*getTenantModel\(\s*(['"])([^'"]+)\2\s*,\s*([^)]+)\s*\);/g, (match, varName, q, modelStr, compId) => {
       return `const ${varName} = ${modelStr}Static; \n    const __tenantCompanyId = ${compId};`;
    });

    // 4. Update `.find({` -> `.find({ companyId: __tenantCompanyId, `
    // Handle `.find({})`
    content = content.replace(/\.find\(\s*\{\s*\}\s*\)/g, `.find({ companyId: __tenantCompanyId })`);
    
    // Handle `.findOne({ name })` -> `.findOne({ name, companyId: __tenantCompanyId })`
    // This is tricky, a simple regex might break nested objects.
    content = content.replace(/\.findOne\(\s*\{([^}]+)\}\s*\)/g, (match, inner) => {
       if (inner.includes('companyId')) return match;
       return `.findOne({ ${inner.trim()}, companyId: __tenantCompanyId })`;
    });

    content = content.replace(/\.find\(\s*\{([^}]+)\}\s*\)/g, (match, inner) => {
       if (inner.trim().length === 0) return `.find({ companyId: __tenantCompanyId })`;
       if (inner.includes('companyId')) return match;
       return `.find({ ${inner.trim()}, companyId: __tenantCompanyId })`;
    });

    content = content.replace(/\.countDocuments\(\s*\{\s*\}\s*\)/g, `.countDocuments({ companyId: __tenantCompanyId })`);
    content = content.replace(/\.countDocuments\(\s*\{([^}]+)\}\s*\)/g, (match, inner) => {
       if (inner.includes('companyId')) return match;
       return `.countDocuments({ ${inner.trim()}, companyId: __tenantCompanyId })`;
    });

    // Handle creates (we need to inject companyId into the document)
    // .create(data) -> .create({ ...data, companyId: __tenantCompanyId })
    // No, create takes an object. Let's just pass data and expect it has companyId, which it does from requests.
    // Wait, we need to push to CompanySchema!
    
    fs.writeFileSync(filePath, content);
    console.log(`Updated: ${filePath}`);
  }
});
