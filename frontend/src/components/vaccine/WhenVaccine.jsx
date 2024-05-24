import React from 'react'
import chart from '../../img/chart.webp';

export default function WhenVaccine() {
  return (
    <div className="text-center container-fluid">
        <h1 className="strong my-3">
          When Vaccination
        </h1>
        <br /> <br />
        <p>
          Prevention of disease is the key to public health. It is a general
          saying that “prevention is always better than cures”. Vaccines protect
          people from catching specific diseases. Vaccines also help preventing
          the Spread of infectious diseases in a country. Such diseases include
          polio, whooping cough, diphtheria, measles, rubella (German measles),
          mumps, Haemophilus influenza type b (Hib) and tetanus{" "}
        </p>
        <br />
        <p>
          Parents are constantly concerned about the health and safety of their
          children. Therefore, they take many steps in order to prevent their
          children from catching a disease. One of the options is vaccination.
          Vaccine works to protect infants, children and even adults from
          illnesses and death caused by many infectious diseases. Vaccination
          has its own time, period and schedule. The dosage of vaccination
          remains the same among babies but may be different for adult.
        </p>
        <div className="py-4">
        <h1 strong>Chart of Vaccines</h1>
          <img src={chart} />
        </div>
      </div>
  )
}
